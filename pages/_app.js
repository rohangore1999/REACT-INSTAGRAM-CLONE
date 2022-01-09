import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'

// destructure that pageProps and pull session and pageProps: {session, ...pageProps}
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}> {/* responsible for authentication */}
      {/* wrapping our entrie component with sessionprovider from next-auth so that to know user is authenticated or not */}

      {/* surrounded our app with recoil root aka global store */}
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  )
}

export default MyApp
