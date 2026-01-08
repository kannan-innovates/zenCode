import nodemailer, { Transporter } from 'nodemailer';
import logger from './logger.util';

/**
 * Email configuration
 * 
 */
class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  /**
   * Send OTP email
   */
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
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">zenCode - Real-time Coding Interview Platform</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`OTP email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending OTP email:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send temporary password to mentor
   */
  async sendTempPassword(email: string, tempPassword: string): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Your zenCode Mentor Account',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to zenCode as a Mentor! 🎓</h2>
            <p>Your account has been created by the admin.</p>
            <p>Your temporary password is:</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <code style="font-size: 18px; color: #1F2937;">${tempPassword}</code>
            </div>
            <p><strong>Important:</strong> You'll be asked to change this password on your first login.</p>
            <p>Login at: <a href="${process.env.FRONTEND_URL}/mentor/login">zenCode Mentor Portal</a></p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">This password expires in 24 hours.</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Temp password email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending temp password email:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send password reset link
   */
  async sendPasswordResetLink(
    email: string,
    resetToken: string,
  ): Promise<void> {
    try {
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Reset Your zenCode Password',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>Click the button below to reset your password:</p>
            <a href="${resetLink}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
              Reset Password
            </a>
            <p>Or copy this link:</p>
            <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all;">
              ${resetLink}
            </p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending password reset email:', error);
      throw new Error('Failed to send email');
    }
  }
}

export default new EmailService();