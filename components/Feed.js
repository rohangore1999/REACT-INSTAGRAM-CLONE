import MiniProfile from "./MiniProfile"
import Posts from "./Posts"
import Stories from "./Stories"
import Suggestions from "./Suggestions"

import { useSession } from "next-auth/react"

function Feed() {
    const { data: session } = useSession()


    return (
        // here for mobile device it will be 1 column, for md(medium device it will be 2 column), for xl(extra large) it will be 6xl max-auto for center
        <main className={`grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto ${!session && "!grid-cols-1 !max-w-3xl"}`}>
            {/* if session is true then !important >>> !grid-cols-1 !max-w-3xl */}


            {/* section - left */}
            {/* col-span-2 >>> this section will take upto 2 cols */}
            <section className="col-span-2">
                {/* stories */}
                <Stories />

                {/* post */}
                <Posts />

            </section>

            {/* Section - Right */}
            {session && (
                <section className="hidden xl:inline-grid md:col-span-1">
                    <div className="fixed top-20">
                        {/* mini profile */}
                        <MiniProfile />

                        {/* suggestions */}
                        <Suggestions />
                    </div>
                </section>
            )
            }


        </main >
    )
}

export default Feed
