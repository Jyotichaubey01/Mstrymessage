import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

// Change this path if your authOptions are in another file
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

   const session = await getServerSession(authOptions);

console.log("SESSION:", session);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { feedbackContext, feedbackInsights } =
      await request.json();

    await UserModel.findOneAndUpdate(
      {
        email: session.user.email,
      },
      {
        feedbackContext,
        feedbackInsights,
      },
      {
        new: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Feedback saved successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const user = await UserModel.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      feedbackContext: user.feedbackContext,
      feedbackInsights: user.feedbackInsights,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}