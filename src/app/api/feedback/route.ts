import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json(
      { success: false },
      { status: 401 }
    );
  }
feedbackContext: {
  type: String,
  default: "",
},

feedbackInsights: {
  type: String,
  default: "",
},
  const { feedbackContext, feedbackInsights } =
    await request.json();

  await UserModel.findOneAndUpdate(
    { email: session.user.email },
    {
      feedbackContext,
      feedbackInsights,
    }
  );

  return NextResponse.json({
    success: true,
  });
}