import { getProviders, signIn as SignIntoProvider } from "next-auth/react"
import Header from "../../components/Header"

//browser running... 
function signIn({ providers }) {
    return (
        <>
            <Header />
            <div className="flex flex-col justify-center items-center min-h-screen py-2 -mt-20 px-14 text-center">
                <img className="w-80" src="https://links.papareact.com/ocw" alt="" />
                <div className="mt-40">
                    {/* imported from https://next-auth.js.org/v3/configuration/pages */}
                    {Object.values(providers).map((provider) => (
                        <div key={provider.name}>
                            <button className="p-3 bg-blue-500 rounded-lg text-white" onClick={() => SignIntoProvider(provider.id, { callbackUrl: '/' })}> {/* { callbackUrl: '/' } >> it will redirect to the home screen */}
                                Sign in with {provider.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </>
    )
}

// server side render
export async function getServerSideProps() {
    const providers = await getProviders()

    return {
        props: {
            providers
        }
    }
}

export default signIn
