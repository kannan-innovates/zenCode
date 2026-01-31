import nodemailer, { Transporter } from 'nodemailer';

export class EmailService {
     private transporter: Transporter;

     constructor() {
          this.transporter = nodemailer.createTransport({
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
               const mailOptions = {
                    from: process.env.SMTP_FROM,
                    to: email,
                    subject: 'Your zenCode Verification Code',
                    html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to zenCode!</h2>
            <p>Your verification code is:</p>
            <h1 style="background: #4F46E5; color: white; padding: 15px; text-align: center; border-radius: 8px;">
              ${otp}
            </h1>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">zenCode - Real-time Coding Interview Platform</p>
          </div>
        `,
               };

               await this.transporter.sendMail(mailOptions);
               console.log(`OTP for ${email} is ${otp}`);
          } catch (error) {
               console.error('Error sending OTP email:', error);
               throw new Error('Failed to send email');
          }
     }
}