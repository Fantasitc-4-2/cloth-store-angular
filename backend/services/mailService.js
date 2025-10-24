import sendEmail from "../utils/email.js";
import { randomInt } from "crypto";

export async function sendOtpEmail(to, otp) {
  const subject = "Your OTP Code";
  const text = `Your OTP is: ${otp}. It is valid for 10 minutes.`;
  const html = `<h2>Your OTP Code</h2><p><b>${otp}</b></p><p>It is valid for 10 minutes.</p>`;

  await sendEmail(to, subject, text, html);
}


 export function  generateOtp() {
  return randomInt(100000, 999999).toString();
}