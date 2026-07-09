import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { Message } from "@/model/User";

export async function POST(request: Request){
    await dbConnect()

    const {username, content} = await request.json()

    try {
        const user = await UserModel.findModel.findOne({username})
        if(!user) {
              return Response.json(
            {
                success: false,
                message: "User not found"
            },
            { status: 404}
        )
        }

        //is user accepting message
        if(!user.isAcceptingMessage) {
              return Response.json(
            {
                success: false,
                message: "user is not accepting the message"
            },
            { status: 403}
        )
        }
     const newMessage = {content, createdAt: new Date()}
     user.messages.push(newMessage as Message)
      await user.save()

        return Response.json(
            {
                success: true,
                message: "messsage sent successfully"
            },
            { status: 401}
        )
    } catch (error) {
        
    }
}