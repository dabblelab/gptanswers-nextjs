import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import jwt from "jsonwebtoken";
import { redirect } from "next/dist/server/api-utils";


export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

  ],

  secret: process.env.SECRET,

  session: {
    jwt: true,
    jwt: {

      secret: process.env.SECRET,

      encode: async ({ secret, token, maxAge }) => {
        const jwtClaims = {
          "sub": token.id,
          "name": token.name,
          "email": token.email,
          "iat": Date.now() / 1000,
          "exp": Math.floor(Date.now() / 1000) + (24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": token.id,
          }

        }

        const encodedToken = jwt.sign(jwtClaims, secret, { algorithm: 'HS256' });
        return encodedToken;
      },

      decode: async ({ secret, token, maxAge }) => {
        const decodedToken = jwt.verify(token, secret, { algorithms: ['HS256'] });
        return decodedToken;
      },
    },
    pages: {
    },

    callbacks: {

      async redirect(url, baseUrl) {
        return"/";
      },
    
      async session(session, token) {
        const encodedToken = jwt.sign(token, process.env.SECRET, {algorithm: 'HS256'})
        session.id = token.id;
        session.token = encodedToken;
        return Promise.resolve(session);
      },

      async jwt(token, user, account, profile, isNewUser) { 
        const isUserSignedIn = user ? true : false;
        if(isUserSignedIn) {
          token.id = user.id;
        }
        return Promise.resolve(token);
       }
    },

    events: {},

    theme: 'light',


    debug: true,
  }

})
