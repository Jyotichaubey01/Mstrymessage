import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function GET(){

 try{

  await dbConnect();


  const session =
    await getServerSession(authOptions);



  if(!session?.user?._id){

    return Response.json(
      {
       success:false,
       message:"Not authenticated"
      },
      {
       status:401
      }
    );

  }



  const user =
    await UserModel.findById(
      session.user._id
    )
    .select("messages");



  if(!user){

    return Response.json(
      {
       success:false,
       message:"User not found"
      },
      {
       status:404
      }
    );

  }



  return Response.json(
    {
      success:true,
      messages:user.messages || []
    },
    {
      status:200
    }
  );


 }
 catch(error){

  console.log(error);

  return Response.json(
   {
    success:false,
    message:"Server error"
   },
   {
    status:500
   }
  );

 }

}