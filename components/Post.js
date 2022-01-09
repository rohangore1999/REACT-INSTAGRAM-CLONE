import { BookmarkIcon, ChatIcon, DotsHorizontalIcon, EmojiHappyIcon, HeartIcon, PaperAirplaneIcon } from "@heroicons/react/outline"

import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid"
import { addDoc, collection, onSnapshot, query, serverTimestamp, orderBy, setDoc, doc, deleteDoc } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { db } from "../firebase"

import Moment from "react-moment"

function Post({ id, username, userImage, img, caption }) {
    // to get authetication from nextjs
    const { data: session } = useSession()

    // for each comment
    const [comment, setComment] = useState("")

    // for comments
    const [comments, setComments] = useState([])

    // for Likes
    const [likes, setLikes] = useState([])


    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, 'posts', id, 'comments'), orderBy('timestamp', 'desc')), snapshot => (setComments(snapshot.docs)))

        // clean up onSnapshot instance as it is
        return unsubscribe
    }, [db, id])


    // for listening comments
    const sendComment = async (e) => {
        //  as we are in form and to handle page refresh after submitting
        e.preventDefault()

        const commentToSend = comment

        setComment('') //set to empty

        // it will add to backend in posts >> id >> commments
        await addDoc(collection(db, 'posts', id, 'comments'), {
            comment: commentToSend,
            usename: session.user.username,
            userImage: session.user.image,
            timestamp: serverTimestamp()
        })

    }


    // for listening likes and updating ther useState of  Likes
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) => setLikes(snapshot.docs))

        return unsubscribe
    }, [db, id]) //anything we use outside the useeffect should consider here


    // it will store into the database that this user liked post with the username
    const likePost = async () => {
        if (hasLiked) {
            // if user already liked .... means its a dislike(remove the like)
            // deletedoc
            await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid))

        } else {

            // first time liked
            await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
                username: session.user.username
            })
        }


    }


    // for has likes
    const [hasLiked, setHasLiked] = useState(false)

    // to store the liked post in HasLiked use state
    useEffect(() => {
        // likes.findIndex >>> will find the index on condition >>> the person who liked... it will search that if that post is already liked by same id 

        // it will return -1 if it couldnt find index >>> to handle no likes condition
        const unsubscribe = setHasLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1)

        return unsubscribe
    }, [likes]) //depended only likes arrary

    console.log("HasLiked >>>", hasLiked)

    return (
        <div className="bg-white my-7 border-rounded-sm">
            {/* header */}
            <div className="flex items-center p-5">
                <img src={userImage} className="rounded-full h-12 w-12 object-contain border p-1 mr-3" alt="" />

                <p className="flex-1 font-bold">{username}</p>
                <DotsHorizontalIcon className="h-5" />
            </div>

            {/* img */}
            <img src={img} className="object-cover w-full" />

            {/* buttons */}
            {session && (
                <div className="flex justify-between px-4 pt-4">
                    <div className="flex space-x-4">
                        {/* if hasLiked is true means already it is liked so HeartIcon must be filled; else outline */}
                        {hasLiked ? (
                            <HeartIconFilled onClick={likePost} className="btn text-red-500"  />
                        ) : (
                            <HeartIcon onClick={likePost} className="btn" />
                        )}

                        <ChatIcon className="btn" />
                        <PaperAirplaneIcon className="btn" />
                    </div>

                    <BookmarkIcon className="btn" />
                </div>
            )}

            {/* captions */}
            <div className="p-5 truncate">
                {likes.length > 0 && (
                    <p className="font-bold mb-1">{likes.length} likes</p>
                )}
                <span className="font-bold mr-1">{username} </span>
                {caption}
            </div>


            {/* comments */}
            {comments.length > 0 ? (
                <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex items-center space-x-2 mb-3">
                            <img className="h-7 rounded-full" src={comment.data().userImage} alt="" />

                            {/* if we want to get data from firebase then we need to use .data() and field value */}
                            <p className="text-sm flex-1"><span className="font-bold">{comment.data().usename}</span> {" "} {comment.data().comment}</p>

                            {/* to show the timestamp (last message) */}
                            <Moment fromNow className="pr-5 text-sm">
                                {comment.data.timestamp?.toDate()}
                            </Moment>
                        </div>
                    ))}
                </div>
            ) : (<></>)}


            {/* input box */}
            {session && (
                <form className="flex items-center p-4">
                    <EmojiHappyIcon className="h-7" />
                    <input value={comment} onChange={(e) => setComment(e.target.value)} className="border-none flex-1 focus:ring-0 outline-none" placeholder="Add a comment..." type={'text'} />
                    <button type="submit" disabled={!comment} onClick={sendComment} className="font-semibold text-blue-400">Post</button>
                </form>
            )}

        </div>
    )
}

export default Post
