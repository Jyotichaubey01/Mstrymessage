
import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  otp: string;
}

export const EmailTemplate = ({
  firstName,
  otp,
}: EmailTemplateProps) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    >
      <h1 style={{ color: "#2563eb" }}>Welcome to Mystery Message 🎉</h1>

      <p>Hi {firstName},</p>

      <p>
        Thank you for signing up! Use the verification code below to verify your
        account.
      </p>

      <div
        style={{
          background: "#f3f4f6",
          padding: "16px",
          textAlign: "center",
          borderRadius: "6px",
          margin: "20px 0",
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            letterSpacing: "6px",
            color: "#111827",
            margin: 0,
          }}
        >
          {otp}
        </h2>
      </div>

      <p>
        This OTP is valid for <strong>10 minutes</strong>.
      </p>

      <p>
        If you didn't request this verification, you can safely ignore this
        email.
      </p>

      <hr style={{ margin: "24px 0" }} />

      <p style={{ fontSize: "14px", color: "#6b7280" }}>
        Regards,
        <br />
        <strong>Mystery Message Team</strong>
      </p>
    </div>
  );
};

export default EmailTemplate;