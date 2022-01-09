import { useRecoilState } from "recoil"
import { modalState } from "../atoms/modalAtom"
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useRef, useState } from "react"
import { CameraIcon } from "@heroicons/react/outline"

import { db, storage } from "../firebase"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { ref, getDownloadURL, uploadString } from "firebase/storage"
import { async } from "@firebase/util"

function Modal() {
    const [open, setOpen] = useRecoilState(modalState)


    const filePickerRef = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null)

    const addImageToPost = (e) => {
        // image which we have selected

        // file reader
        const reader = new FileReader()

        if (e.target.files[0]) {
            // checking if the file which user has selected is present or not (only one file should be selected so accessing only 1st file)
            reader.readAsDataURL(e.target.files[0]);
        }

        // once browser done with reading file, reader.onload will run and get that object in readerEvent, and set to selectedFile
        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result)
        }
    }

    // console.log(selectedFile)

    // for caption reference
    const captionRef = useRef(null)


    // Loading >> when user click on upload button .. to handle state
    const [loading, setLoading] = useState(false)


    // user data from next auth
    const { data: session } = useSession()


    // to upload post
    const uploadPost = async () => {
        // if already clicked Post then return... no need to go further
        if (loading) return

        // else ... 
        // set loading to True 
        setLoading(true)

        // FIREBASE...
        // 1) Create a post and add to firestore in 'post' collection
        // 2) get the post id for the newly created post
        // 3) upload the image to firebase storage with the post id
        // 4) get a download url from the firebase storage and update to post collection with new entry(image)


        // 1) Creating a 'posts' collection using addDoc() function 
        const docRef = await addDoc(collection(db, 'posts'), {
            username: session.user.username,
            caption: captionRef.current.value,
            profileImg: session.user.image,
            timestamp: serverTimestamp()
        })

        // 2) ID of newly created post >>> docRef.id
        console.log("New doc added with ID", docRef.id)


        // 3) upload the image to firebase storage it this path(bucket): `posts/${docRef.id}/image`
        const imageRef = ref(storage, `posts/${docRef.id}/image`)

        // uploadString is taking path(imageRef >> `posts/${docRef.id}/image`) and the file which is selected
        // as we have the selectedFile as a url type so we are making the datatype as "data_url"
        await uploadString(imageRef, selectedFile, "data_url").then(async snapshot => {
            const downloadURL = await getDownloadURL(imageRef) //after uploading the image to bucket/firebase storage THEN we will now generate the downloadURL so as to update in our firebase database inside "posts"

            // 4) get a download url from the firebase storage and update to post collection with new entry(image)
            // updateDoc >> the fucn which is use to update document.
            // doc will used to point to certain document in firestore
            // it will go to db >> under post >>> current post id 
            await updateDoc(doc(db, 'posts', docRef.id), {
                // new info which I've to update
                image: downloadURL
            })

        })

        // setModel to false
        setOpen(false)

        // setLoading to false
        setLoading(false)

        // setSelectedFile to null
        setSelectedFile(null)

    }


    return (
        <Transition.Root show={open} as={Fragment}>
            {/* Reference ~ https://headlessui.dev/react/dialog  */}


            {/* Transition.Root it will show when open is true >>> show={open}, its behaviour as React's Fragment <> </>*/}

            <Dialog as='div' className='fixed z-10 inset-0 overflow-y-auto' onClose={setOpen}>
                <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        {/* thing which actually show on screen */}
                        <Dialog.Overlay className={"fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"} />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">

                            <div>
                                {/* if selectedfile is present then preview that file else show the camera icon */}
                                {selectedFile ? (
                                    <img className="w-fill object-contain cursor-pointer" src={selectedFile} onClick={() => setSelectedFile(null)} />
                                ) : (
                                    <div onClick={() => filePickerRef.current.click()} className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer">
                                        <CameraIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                    </div>
                                )}


                                <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title as="h3" className="text-lg text-center font-medium leading-6 text-gray-900">
                                        Upload a photo
                                    </Dialog.Title>

                                    {/* to upload Image, but it is hidden*/}
                                    {/* useRef >>  filePickerRef is pointing as a reference*/}
                                    {/* when camera icon clicked this input field get open for file */}
                                    <div>
                                        <input ref={filePickerRef} type="file" hidden onChange={addImageToPost} />
                                    </div>

                                    {/* for Caption */}
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            ref={captionRef}
                                            className="border-none focus:ring-0 w-full text-center"
                                            placeholder="Please enter a caption..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* actual content */}
                            <div>
                                <button onClick={uploadPost} disabled={!selectedFile} type="button" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300">
                                    {loading ? "Uploading ..." : "Upload Post"}
                                </button>
                            </div>
                        </div>

                    </Transition.Child>

                </div>
            </Dialog >
        </Transition.Root >
    )
}

export default Modal
