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