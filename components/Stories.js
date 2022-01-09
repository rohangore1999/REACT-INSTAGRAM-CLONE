import faker from "faker"
import { useEffect, useState } from "react"
import Story from "./Story"
import { signOut, useSession } from "next-auth/react"

function Stories() {
    // creating an empty array
    const [suggestions, setsuggestions] = useState([])
    const { data: session } = useSession()

    useEffect(() => {
        // [...Array(20)] >>> spreading 20 elements from the array
        // (_, i) >>> dont care about first value and 
        // mapping each elements and returing(implicit ({})) using contextualCard() 
        const suggestion = [...Array(20)].map((_, i) => ({
            ...faker.helpers.contextualCard(),
            id: i
        }))

        // storing data into an arrary
        setsuggestions(suggestion)
        // console.log(faker.image.image())
    }, [])


    return (
        <div className="flex space-x-2 p-6 bg-white mt-8 border-gray-200 border rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-black">
            {session && (
                <Story img={session.user.image} username={session.user.username} />
            )}

            {suggestions.map((profile) => (
                <Story key={profile.id} img={faker.image.image()} username={profile.username} />
            ))}
        </div>
    )
}

export default Stories
