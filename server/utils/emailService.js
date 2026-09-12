import nodemailer from 'nodemailer';
import { SiteSettings } from '../models/SiteSettings.js';

/**
 * Helper to build nodemailer transporter dynamically using DB settings or fallback env vars
 */
export const getTransporter = async () => {
  try {
    const settings = await SiteSettings.findOne();
    const host = settings?.smtpHost || process.env.SMTP_HOST;
    const port = settings?.smtpPort || process.env.SMTP_PORT || 587;
    const user = settings?.smtpUser || process.env.SMTP_USER;
    const pass = settings?.smtpPass || process.env.SMTP_PASS;
    const secure = settings?.smtpSecure || (Number(port) === 465);

    if (host && user && pass) {
      return {
        transporter: nodemailer.createTransport({
          host,
          port: Number(port),
          secure,
          auth: { user, pass }
        }),
        fromEmail: user,
        isConfigured: true
      };
    }
  } catch (err) {
    console.error('Error creating mail transporter:', err.message);
  }

  return {
    transporter: null,
    fromEmail: 'noreply@avstudio.com',
    isConfigured: false
  };
};

/**
 * Send inquiry notification email when a user submits contact form
 */
export const sendContactInquiryEmail = async ({ name, email, phone, message, inquiryId }) => {
  try {
    const settings = await SiteSettings.findOne();
    const targetEmail = settings?.notificationEmail || settings?.email || process.env.NOTIFICATION_EMAIL || 'info@avstudio.com';
    const studioName = settings?.studioName || 'AV STUDIO';

    const { transporter, fromEmail, isConfigured } = await getTransporter();

    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
    const whatsappLink = cleanPhone ? `https://wa.me/${cleanPhone}` : '';

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #07080d; color: #ffffff; padding: 30px 20px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #ff2a85;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 42, 133, 0.3);">
          <h1 style="color: #ff2a85; margin: 0; font-size: 26px; letter-spacing: 2px; text-transform: uppercase;">${studioName}</h1>
          <p style="color: #a0a5b5; margin: 5px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px;">New Client Inquiry Received</p>
        </div>

        <div style="padding: 24px 10px;">
          <div style="background: rgba(255, 255, 255, 0.04); padding: 18px 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ff2a85;">
            <p style="margin: 6px 0; font-size: 15px;"><strong>Client Name:</strong> <span style="color: #fff;">${name}</span></p>
            <p style="margin: 6px 0; font-size: 15px;"><strong>Email Address:</strong> <a href="mailto:${email}" style="color: #ff2a85; text-decoration: none;">${email}</a></p>
            <p style="margin: 6px 0; font-size: 15px;"><strong>Phone Number:</strong> <span style="color: #fff;">${phone || 'Not provided'}</span></p>
            <p style="margin: 6px 0; font-size: 13px; color: #8c93a8;"><strong>Date & Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #ff2a85; margin-bottom: 10px; font-size: 16px;">Client Message:</h3>
            <div style="background: #10121a; border: 1px solid rgba(255, 255, 255, 0.1); padding: 16px; border-radius: 10px; line-height: 1.6; color: #e2e8f0; white-space: pre-line;">
              ${message}
            </div>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 25px;">
            <a href="mailto:${email}?subject=${encodeURIComponent(`Re: Inquiry with ${studioName}`)}" style="display: inline-block; background: #ff2a85; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; margin-right: 10px;">
              Reply via Email
            </a>
            ${whatsappLink ? `
              <a href="${whatsappLink}" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">
                Chat on WhatsApp
              </a>
            ` : ''}
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 12px; color: #6b7280;">
          This is an automated notification dispatched from the ${studioName} Website Contact Form.
        </div>
      </div>
    `;

    if (isConfigured && transporter) {
      const info = await transporter.sendMail({
        from: `"${studioName} Website" <${fromEmail}>`,
        to: targetEmail,
        replyTo: email,
        subject: `📸 New Inquiry: ${name} via ${studioName}`,
        html: htmlContent
      });
      console.log('✅ Notification email dispatched to:', targetEmail, info.messageId);
      return { success: true, delivered: true, recipient: targetEmail };
    } else {
      // In dev or without SMTP, log the complete message notification cleanly
      console.log(`\n📬 [EMAIL NOTIFICATION SAVED & SIMULATED]`);
      console.log(`To: ${targetEmail}`);
      console.log(`From: ${name} (${email}, ${phone})`);
      console.log(`Message: ${message}`);
      console.log(`Note: Configure SMTP in Admin Settings -> Inquiries & Email to deliver live emails via SMTP.\n`);
      return { success: true, delivered: false, simulated: true, recipient: targetEmail };
    }
  } catch (error) {
    console.error('❌ Failed to send email notification:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send test email to verify SMTP configuration
 */
export const sendTestEmail = async ({ testRecipient }) => {
  try {
    const settings = await SiteSettings.findOne();
    const studioName = settings?.studioName || 'AV STUDIO';
    const recipient = testRecipient || settings?.notificationEmail || 'info@avstudio.com';

    const { transporter, fromEmail, isConfigured } = await getTransporter();

    if (!isConfigured || !transporter) {
      return {
        success: false,
        message: 'SMTP credentials are incomplete. Please provide Host, Port, User, and Password in Admin Settings.'
      };
    }

    const info = await transporter.sendMail({
      from: `"${studioName} Setup" <${fromEmail}>`,
      to: recipient,
      subject: `⚡ Test Notification: ${studioName} Email Verification`,
      html: `
        <div style="font-family: sans-serif; background: #0b0c14; color: #fff; padding: 25px; border-radius: 12px; border: 1px solid #10b981;">
          <h2 style="color: #10b981; margin-top: 0;">✅ Email Connection Successful!</h2>
          <p>Your SMTP credentials for <strong>${studioName}</strong> are configured correctly.</p>
          <p>All future client contact inquiries submitted through your website will be delivered to this email address: <strong>${recipient}</strong>.</p>
          <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Sent at ${new Date().toLocaleString()} IST</p>
        </div>
      `
    });

    return {
      success: true,
      message: `Test email successfully sent to ${recipient}!`,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending test email:', error);
    return {
      success: false,
      message: `SMTP Error: ${error.message}`
    };
  }
};
