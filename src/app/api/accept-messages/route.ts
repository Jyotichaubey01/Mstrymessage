import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
      if (!session || !session.user) {
          return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401}
        )
      }
      const userId = user._id;
      const {acceptMessages} = await request.json()

      try {
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages},
            {new: true}
        )

        if (!updateUser) {
             return Response.json(
            {
                success: false,
                message: "falid to update user stauts to accept messages"
            },
            { status: 401}
        )
        }

          return Response.json(
            {
                success: true,
                message: "Message acceptance status update successfully"
                updateUser
            },
            { status: 200}
        )
        
      } catch (error) {
        console.log("falied to update user status to accpt message");
         return Response.json(
            {
                success: false,
                message: "falid to update user stauts to accept messages"
            },
            { status: 500}
        )
        
      }
}


export async function GET(request: Request){
      await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
      if (!session || !session.user) {
          return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401}
        )
      }
      const userId = user._id;

      try {
        const foundUser = await UserModel.findById(userId)
       if (!foundUser) {
             return Response.json(
            {
                success: false,
                message: "User not found"
            },
            { status: 404}
        ) 
    }

     if (!foundUser) {
             return Response.json(
            {
                success: false,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
            { status: 200}
        ) 
        
      } catch (error) {
        console.log("falied to update user status to accpt message");
         return Response.json(
            {
                success: false,
                message: "error is geting message acceptance status"
            },
            { status: 500}
        )
        
      
        
      }

}