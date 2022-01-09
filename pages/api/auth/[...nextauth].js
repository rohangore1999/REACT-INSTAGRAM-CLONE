// page to refer: https://next-auth.js.org/getting-started/example

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],

  pages: {
    signIn: "/auth/signin"
  },

  // when bydefault callbacks only return email, profile only, so to modify ...
  callbacks: {
    async session({ session, token, user }) {
      session.user.username = session.user.name.split(" ").join("").toLocaleLowerCase()
      // to make additional callbacks >>> if user.name is Rohan Gore, it will make it rohangore
      // it will split on space and then join by triming the space all to lower case

      session.user.uid = token.sub //token.sub >>> it is the google's  userid
      return session
    }
  }
})