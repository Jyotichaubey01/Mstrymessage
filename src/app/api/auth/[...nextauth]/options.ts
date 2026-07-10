import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {

  providers: [

    CredentialsProvider({

      id:"credentials",

      name:"Credentials",

      credentials:{
        identifier:{
          label:"Email or Username",
          type:"text",
        },
        password:{
          label:"Password",
          type:"password",
        }
      },


      async authorize(credentials){

        await dbConnect();

        if(
          !credentials?.identifier ||
          !credentials?.password
        ){
          throw new Error(
            "Missing credentials"
          );
        }


        const user = await UserModel.findOne({
          $or:[
            {
              email:credentials.identifier
            },
            {
              username:credentials.identifier
            }
          ]
        });


        if(!user){
          throw new Error(
            "User not found"
          );
        }


        const isPasswordCorrect =
          await bcrypt.compare(
            credentials.password,
            user.password
          );


        if(!isPasswordCorrect){
          throw new Error(
            "Invalid password"
          );
        }


        return {
          _id:user._id.toString(),
          username:user.username,
          email:user.email,
        };

      }

    })

  ],



  callbacks:{

    async jwt({token,user}){

      if(user){
        token._id=user._id;
        token.username=user.username;
        token.email=user.email;
      }

      return token;
    },


    async session({session,token}){

      if(session.user){

        session.user._id =
          token._id as string;

        session.user.username =
          token.username as string;

        session.user.email =
          token.email as string;

      }


      return session;

    }

  },


  session:{
    strategy:"jwt"
  },


  pages:{
    signIn:"/sign-in"
  },


  secret:process.env.NEXTAUTH_SECRET

};