import nodemailer, { Transporter } from 'nodemailer';
import { AppError } from '../../../shared/utils/AppError';
import { STATUS_CODES } from '../../../shared/constants/status';
import { AUTH_MESSAGES } from '../../../shared/constants/messages';

export class EmailService {

     private _transporter: Transporter;

     constructor() {
          this._transporter = nodemailer.createTransport({
               host: process.env.SMTP_HOST,
               port: Number(process.env.SMTP_PORT),
               secure: Number(process.env.SMTP_PORT) === 465,
               auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
               },
          });
     }

     async sendOTP(email: string, otp: string): Promise<void> {
          try {
               await this._transporter.sendMail({
                    from: process.env.SMTP_FROM,
                    to: email,
                    subject: 'YOUR ZENCODE VERIFICATION CODE',
                    html: `
                    <div style="'JetBrains Mono',Consolas, 'Courier New',; padding: 20px;">
                    <h2>Welcome to zenCode!</h2>
                     <p>Your verification code is:</p>
                    <h1 style="background: #4F46E5; color: white; padding: 15px; text-align: center; border-radius: 8px;">
                    ${otp}
                  </h1>
                    <p>This code will expire in 5 minutes.</p>
                      <p>If you didn't request this code, please ignore this email.</p>
                    <hr style="margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">zenCode - Real-time Coding Interview Platform</p>
                </div>`
               })
          } catch (error) {
               throw new AppError(
                    AUTH_MESSAGES.EMAIL_SEND_FAILED,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
               )
          }
     }

     async sendPasswordResetLink(email: string, resetLink: string): Promise<void> {
          try {
               await this._transporter.sendMail({
                    from: process.env.SMTP_FROM,
                    to: email,
                    subject: 'Click the link below to reset your password:',
                    html: `
                     <div style="font-family:  'JetBrains Mono', Consolas, 'Courier New', monospace; ; padding: 20px;">
                         <h2>Password Reset Request</h2>
                          <p>Click the link below to reset your password:</p>
                         <a href="${resetLink}" style="color: #4F46E5;">
                          Reset Password
                         </a>
                         <p>This link expires in 15 minutes.</p>
                         <p>If you didn’t request this, ignore this email.</p>
                    </div>
                    `
               })
          } catch (error) {
               throw new AppError(
                    AUTH_MESSAGES.EMAIL_SEND_FAILED,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
               )
          }
     }



}