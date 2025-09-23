// lib/email.ts
import nodemailer from 'nodemailer';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email templates
const emailTemplates = {
  verification: (name: string, verificationCode: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
        <h1>CELTM</h1>
        <h2>Email Verification</h2>
      </div>
      
      <div style="padding: 20px; background-color: #f9fafb;">
        <h3>Hello ${name},</h3>
        
        <p>Thank you for registering with CELTM! To complete your registration, please use the verification code below:</p>
        
        <div style="background-color: white; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #2563eb; font-size: 36px; margin: 0; letter-spacing: 8px;">${verificationCode}</h1>
        </div>
        
        <p><strong>Important:</strong></p>
        <ul>
          <li>This code will expire in 10 minutes</li>
          <li>Do not share this code with anyone</li>
          <li>If you didn't request this, please ignore this email</li>
        </ul>
        
        <p>If you have any questions, please contact our support team.</p>
        
        <p>Best regards,<br>The CELTM Team</p>
      </div>
      
      <div style="background-color: #374151; color: white; padding: 10px; text-align: center; font-size: 12px;">
        <p>© 2025 CELTM. All rights reserved.</p>
      </div>
    </div>
  `,

  resendVerification: (name: string, verificationCode: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
        <h1>CELTM</h1>
        <h2>New Verification Code</h2>
      </div>
      
      <div style="padding: 20px; background-color: #f9fafb;">
        <h3>Hello ${name},</h3>
        
        <p>You requested a new verification code. Please use the code below:</p>
        
        <div style="background-color: white; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #2563eb; font-size: 36px; margin: 0; letter-spacing: 8px;">${verificationCode}</h1>
        </div>
        
        <p><strong>This code will expire in 10 minutes.</strong></p>
        
        <p>Best regards,<br>The CELTM Team</p>
      </div>
    </div>
  `
};

// Email service functions
export const emailService = {
  sendVerificationEmail: async (email: string, name: string, verificationCode: string) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'CELTM - Email Verification Code',
      html: emailTemplates.verification(name, verificationCode)
    };

    return await transporter.sendMail(mailOptions);
  },

  sendResendVerificationEmail: async (email: string, name: string, verificationCode: string) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'CELTM - New Verification Code',
      html: emailTemplates.resendVerification(name, verificationCode)
    };

    return await transporter.sendMail(mailOptions);
  }
};

export default emailService;