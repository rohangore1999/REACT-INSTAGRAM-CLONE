import Head from 'next/head'
import Feed from '../components/Feed'
import Header from '../components/Header'
import Modal from '../components/Modal'

export default function Home() {
  return (
    // to hide the scroll bar of entire screen
    <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
      <Head>
        <title>Instagram Clone</title>
        <link rel="icon" href="/favicon.ico" />

        {/* for post picture */}
        <meta property="og:title" content="" />
        <meta property="og:type" content="" />
        <meta property="og:image" content="./favicon.png" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:description" content="" />
        <meta name="twitter:image:alt" content=""/>
      </Head>

      {/* Header */}
      <Header />


      {/* feed */}
      <Feed />

      {/* modal- to upload image */}
      <Modal />

    </div>
  )
}
