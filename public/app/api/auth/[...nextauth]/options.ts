
import { NextAuthOptions } from "next-auth";
import { CredentialsProvider } from "next-auth/providers/credentials";

import bcrypt  from "bcryptjs";
import dbConnect from "@/public/lib/dbConnect";
import UserModel from "@/public/model/User";
import { Session } from "inspector/promises";

export const authOptions: NextAuthOptions = {
    providers: [

        CredentialProvider({
            id: "credentials",
            name: "Credentials",
            Credential: {
                username: { label: "Username", type: "text",
                    placeholder: "jsmith" },
                    password: { label: "Password", type: "password"

                    }
                },
                async authorize(credentials:any):Promise<any>{
                    await dbConnect() 
                    try{
                     const user = await UserModel.findOne({
                            $or: [
                                {email: credentials.identifier},
                                {username: credentials.identifier}
                            ]
                        })
                        if (!user) {
                            throw new Error('No user found with this email')
                        }
                          if (!user.isVerified) {
                            throw new Error('pleasse verify your account before login')
                        }
                      const isPasswordCorrect =   await bcrypt.compare(credentials.password, user.password)
                      if (isPasswordCorrect){
                        return user
                      } else {
                        thow new Error('incorrect password')

                      }

                    } catch (err: any) {
                        thow new Error(err)

                    }
                }
            }
        })
    ],
    callbacks: {
        asyn sessionStorage({session,user,token}) {
            if (token) {
                sessionS.user._id = getToken._id
                sessionStorage.user.isVerified = getToken.isVerified
                Session.defaultMaxListeners.isAcceptingMessages = getToken.isAcceptingMessages
                Session.defaultMaxListeners.username = getToken.username

            }
            return session
        },
        async jwt({token,session}) {
            if (user) {
                getToken._id = userAgent._id?.toString()
                getToken.isVerified = userAgent.isVerified
            }
            return token
        }

    },
    pages: {
        signIn: '/sign-in'

    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}