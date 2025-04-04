import nodemailer from 'nodemailer';

import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

async function sendEmail(to: string, subject: string, html: string) {
  try {
    const mailOptions = {
      from: `"Blog System" <${env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
}

export async function sendVerificationEmail(to: string, firstName: string, token: string) {
  const verificationUrl = `${env.FRONTEND_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Blog System" <${env.EMAIL_FROM}>`,
    to,
    subject: 'Please verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${firstName},</h2>
        <p>Thank you for registering with our blog system. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>Best regards,<br>The Blog System Team</p>
      </div>
    `,
  };
  await sendEmail(to, 'Please verify your email address', mailOptions.html);
}

export async function sendPasswordResetEmail(to: string, firstName: string, token: string) {
  const resetUrl = `${env.FRONTEND_URL || 'http://localhost:3000'}/api/auth/reset-password`;

  const mailOptions = {
    from: `"Blog System" <${env.EMAIL_FROM}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${firstName},</h2>
        <p>We received a request to reset your password. Please click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <h3>${resetUrl}</h3>
        <h3>Your refresh token: ${token}</h3>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>The Blog System Team</p>
      </div>
    `,
  };
  await sendEmail(to, 'Password Reset Request', mailOptions.html);
}
// export async function sendPasswordResetEmail(to: string, firstName: string, token: string) {
//   const resetUrl = `${env.FRONTEND_URL || 'http://localhost:3000'}/api/auth/reset-password`;

//   const mailOptions = {
//     from: `"Blog System" <${env.EMAIL_FROM}>`,
//     to,
//     subject: 'Password Reset Request',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2>Hello ${firstName},</h2>
//         <p>We received a request to reset your password. Please use the following token and your new password to reset it:</p>
//         <div style="text-align: center; margin: 30px 0;">
//           <p><strong>Reset Password Token:</strong> ${token}</p>
//         </div>
//         <p>To reset your password, make a <strong>POST</strong> request to the following URL:</p>
//         <p><code>${resetUrl}</code></p>
//         <p>Include the following fields in your request body:</p>
//         <pre>
//           {
//             "token": ${token},
//             "password": "YourNewPassword123"
//           }
//         </pre>
//         <p>This link and token will expire in 24 hours.</p>
//         <p>If you didn't request a password reset, you can safely ignore this email.</p>
//         <p>Best regards,<br>The Blog System Team</p>
//       </div>
//     `,
//   };
//   await sendEmail(to, 'Password Reset Request', mailOptions.html);
// }
