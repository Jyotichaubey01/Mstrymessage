import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";


export async function GET(){

  const session = await getServerSession(authOptions);

  console.log("SESSION:", session);

  return Response.json({
    session
  });

}