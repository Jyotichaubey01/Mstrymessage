import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function GET(request: Request) {

  try {

    await dbConnect();


    const session = await getServerSession(authOptions);


    console.log("SESSION:", session);


    if (!session?.user) {

      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        {
          status: 401,
        }
      );

    }


    const userId = session.user._id;


    if (!userId) {

      return Response.json(
        {
          success: false,
          message: "User ID missing from session",
        },
        {
          status: 400,
        }
      );

    }



    const user = await UserModel.findById(userId)
      .select("messages");



    if (!user) {

      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );

    }



    return Response.json(
      {
        success: true,
        messages: user.messages || [],
      },
      {
        status: 200,
      }
    );



  } catch (error) {


    console.log(
      "GET MESSAGE ERROR:",
      error
    );


    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );

  }

}