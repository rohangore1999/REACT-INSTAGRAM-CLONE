import Image from "next/image"
import { SearchIcon, PlusCircleIcon, UserGroupIcon, HeartIcon, PaperAirplaneIcon, MenuIcon } from '@heroicons/react/outline'
import { HomeIcon } from '@heroicons/react/solid'
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useRecoilState } from "recoil"
import { modalState } from "../atoms/modalAtom"

function Header() {
    // from useSession we are descturcting the response as { data } and renaming it as session >>> {data: session}
    const { data: session } = useSession()

    // buildin nextjs router
    const router = useRouter()
    // console.log(session)


    // to use data from RECOIL
    // it is just like useState, we can use setOpen to update.
    const [open, setOpen] = useRecoilState(modalState) //modalState we are importing from atoms/modalAtom which we created only to store modal details

    return (
        <div className="shadow-sm border-b bg-white sticky top-0 z-50"> {/* sticky top-0 >>> to make it sticky and fixed to top*/}
            <div className="flex justify-between max-w-6xl mx-5 lg:mx-auto">

                {/* Left side  */}
                {/* IMP NOTE: FLEX by Default styles for the mobile, so with the help of the breakpoints we can style them for desktop as well  as for the mobile */}

                {/* below we have hidden >> means for mobile it will be hidden*/}
                {/* lg >> for large screen it will show */}

                <div onClick={() => router.push('/')} className="relative hidden lg:inline-grid w-24" >
                    {/* Image component is from NEXTJs, when you send request to server in NextJs we have middleware so the requests (eg img) pass through it and NextJs compress the Images to WebP (it reduce the size bt retain the quality)  */}
                    {/* IMP NOTE: when we are passing imgs through that middleserver Next js we need to whitelist the domain from which we are sending img src in next.config.js file */}

                    {/* layout="fill" >> that max possible size, so we are wrapping it with div and resize our div container */}

                    {/* making div relative because any child component who are there inside will change acc to its parent(relative to its parent) */}

                    <Image src={'https://links.papareact.com/ocw'} layout="fill" objectFit="contain" />
                </div>


                {/* for mobile below img will be shown and for large screen we are hidding  */}
                {/* flex-shrink-0 >>> img should not shrink for smaller screen  */}

                <div onClick={() => router.push('/')} className="relative w-10 flex-shrink-0 cursor-pointer  lg:hidden " >
                    <Image src={'https://links.papareact.com/jjm'} layout="fill" objectFit="contain" />
                </div>


                {/* Middle side - Search Input Field  */}
                <div className="max-w-xs">
                    <div className="mt-1 relative p-3 rounded-md">
                        <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <input className="bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-black focus:border-black" type={'text'} placeholder="Search" />
                    </div>
                </div>


                {/* Right side  */}
                {/* space-x-4 >>> child component spacing */}
                <div className="flex items-center justify-end space-x-4">
                    <HomeIcon onClick={() => router.push('/')} className="navBtn" />
                    {/* <MenuIcon className="h-6 md:hidden cursor-pointer" /> md screen and above it will hide */}
                    <PlusCircleIcon onClick={() => setOpen(true)} className=" sm:h-16 w-16 md:hidden lg:h-10 w-10" />
                    {session ? (
                        <>
                            <div className="relative navBtn">
                                <PaperAirplaneIcon className="navBtn rotate-45" />

                                <div className="absolute -top-1 -right-2 bg-red-500 rounded-full h-5 w-5 flex justify-center items-center animate-pulse text-white">3
                                </div>
                            </div>

                            <PlusCircleIcon onClick={() => setOpen(true)} className="navBtn" />
                            <UserGroupIcon className="navBtn" />
                            <HeartIcon className="navBtn" />

                            <img onClick={signOut} src={session?.user?.image} className="h-10 w-10 rounded-full cursor-pointer object-contain" alt="Profile Pic" />
                        </>
                    ) : (
                        <button onClick={signIn}>Sign In</button>
                    )}



                </div>

            </div>
        </div>
    )
}

export default Header
