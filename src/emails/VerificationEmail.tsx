import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Preview,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code: {otp}</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "24px",
            borderRadius: "8px",
            maxWidth: "480px",
            margin: "40px auto",
          }}
        >
          <Heading style={{ fontSize: "20px", color: "#111" }}>
            Hi {username},
          </Heading>
          <Text style={{ fontSize: "16px", color: "#333" }}>
            Thanks for signing up! Please use the verification code below to
            verify your email address:
          </Text>
          <Text
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              letterSpacing: "4px",
              color: "#111",
              margin: "16px 0",
            }}
          >
            {otp}
          </Text>
          <Text style={{ fontSize: "14px", color: "#666" }}>
            This code will expire in 1 hour. If you didn't request this,
            you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}