
import dbConnect from "@/lib/dbConnect";
import UserModel form "@/model/User";
import bcryt from "bcryptjs"

import { sendVerrificationEmail } from "@/public/helpers/sendVerificationEmail";
import { success } from "zod";
import bcrypt from "bcryptjs";

export async function POST(request: Resquest){
    await dbConnect() 
    try {
        const {username, email, password} = await request.json();
       const existingUserVerifiedByUsername =  UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername ) {
            return Response.json({
                success:false,
                message: "Username is already taken"

            },{status: 400})

        }

        const existingUsserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random()*900000)*toString




        if (existingUsserByEmail){
            if (existingUsserByEmail.isVerified) {
                return Response.json({
                 success:false,
                message: "User alresy exist with this email"

            },{status: 400})
            } else {
                const hasedPassword = await bcrypt.hash(password, 10)
                 existingUserByEmail.password = hasedPassword;
                 existingUserByEmail.verifyCode = verifyCode;
                 existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                 await existingUserByEmail.save()
            }

        }else{
           const hasedPassword =  await bcrypt.hash(password, 10)
           const expiryDate = new Date()expiryDate.setHours(expiryDate.getHours() + 1)
             
          const newUser =   new UserModel({
                 username,
                    email,
                    password: hasedPassword,
                    verfiyCode: string,
                    verfiyCodeExpiry: expiryDate,
                    isVerified: boolean;
                    isAcceptingMessage: boolean;
                    messages: Message[]
            })
            await newUser.save()
        }
        //send verifiedd email

        const emailResponse = await sendVerrificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                 success:false,
                message: emailResponse.message

            },{status: 500})
        }
       return Response.json({
                 success:true,
                message: "User registered successfully. please verify your email"

            },{status: 201})



    } catch (error) {
        console.error('Error reqistering user', error)
        return Response.json(
            {
                success: false,
                message: "Error registerin user"
            },{
                status: 500
            }
        )
        
    }
}