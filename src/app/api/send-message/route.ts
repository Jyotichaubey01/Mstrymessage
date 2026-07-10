import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

  await dbConnect();


  try {

    const { username, content } =
      await request.json();


    console.log(
      "REQUEST DATA:",
      {
        username,
        content
      }
    );


    if(!username || !content){

      return NextResponse.json(
        {
          success:false,
          message:"Missing fields"
        },
        {
          status:400
        }
      );

    }



    const user =
      await UserModel.findOne({
        username
      });



    console.log(
      "FOUND USER:",
      user
    );



    if(!user){

      return NextResponse.json(
        {
          success:false,
          message:"User not found"
        },
        {
          status:404
        }
      );

    }



    if(!user.isAcceptingMessages){

      return NextResponse.json(
        {
          success:false,
          message:"User is not accepting messages"
        },
        {
          status:403
        }
      );

    }




    user.messages.push({

      content: content,

      createdAt: new Date()

    });



    await user.save();



    console.log(
      "UPDATED USER:",
      user.messages
    );



    return NextResponse.json(
      {
        success:true,
        message:"Feedback Saved Successfully"
      },
      {
        status:200
      }
    );


  }
  catch(error){

    console.log(
      "SEND MESSAGE ERROR:",
      error
    );


    return NextResponse.json(
      {
        success:false,
        message:"Internal server error"
      },
      {
        status:500
      }
    );

  }

}