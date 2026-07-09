import { Resend } from "resend";
import VerificationEmail from "@/emails/VerificationEmail"; // adjust path to wherever this component actually lives

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
) {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      react: VerificationEmail({
        username,
        otp: verifyCode,
      }),
    });

    return {
      success: true,
      message: "Verification email sent",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to send email",
    };
  }
}