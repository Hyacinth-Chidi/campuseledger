import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "";
const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const emailFrom = process.env.EMAIL_FROM || "CampusLedger <noreply@campusledger.com>";

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log("-------------------------------------------------------");
    console.log(`[EMAIL MOCK] To: ${to}`);
    console.log(`[EMAIL MOCK] Subject: ${subject}`);
    console.log(`[EMAIL MOCK] Content:\n${html}`);
    console.log("-------------------------------------------------------");
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: emailFrom,
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw so we don't break the main API flow
  }
}

const baseStyles = `
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #334155;
  background-color: #f8faff;
  margin: 0;
  padding: 40px 20px;
`;

const containerStyles = `
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  border: 1px solid #e0e7ff;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  overflow: hidden;
`;

const headerStyles = `
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  padding: 32px 40px;
  text-align: center;
`;

const headerLogoStyles = `
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0;
`;

const contentStyles = `
  padding: 40px;
`;

const buttonWrapStyles = `
  text-align: center;
  margin: 32px 0;
`;

const buttonStyles = `
  display: inline-block;
  background-color: #2563eb;
  color: #ffffff;
  text-decoration: none;
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
`;

const footerStyles = `
  background-color: #f8fafc;
  padding: 24px 40px;
  text-align: center;
  border-top: 1px solid #e2e8f0;
  font-size: 14px;
  color: #64748b;
`;

export async function sendInstitutionApprovedEmail(to: string, institutionName: string) {
  const html = `
    <div style="${baseStyles}">
      <div style="${containerStyles}">
        <div style="${headerStyles}">
          <h1 style="${headerLogoStyles}">CampusLedger</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 700;">Account Approved</h2>
          <p style="font-size: 16px; color: #475569;">Hello,</p>
          <p style="font-size: 16px; color: #475569;">Great news! Your institution account for <strong>${institutionName}</strong> has been verified and approved by the CampusLedger administration team.</p>
          <p style="font-size: 16px; color: #475569;">You now have full access to the portal and can begin issuing verifiable credentials on the blockchain to your students.</p>
          
          <div style="${buttonWrapStyles}">
            <a href="http://localhost:3000/student/login" style="${buttonStyles}">Log in to your Dashboard</a>
          </div>
          
          <p style="font-size: 16px; color: #475569; margin-bottom: 0;">If you have any questions, please reply to this email.</p>
        </div>
        <div style="${footerStyles}">
          &copy; ${new Date().getFullYear()} CampusLedger. All rights reserved.<br/>
          Secure verifiable credentials on the blockchain.
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to,
    subject: "✅ CampusLedger: Your Institution is Approved",
    html,
  });
}

export async function sendStudentInviteEmail(to: string, name: string, activationLink: string, institutionName: string) {
  const html = `
    <div style="${baseStyles}">
      <div style="${containerStyles}">
        <div style="${headerStyles}">
          <h1 style="${headerLogoStyles}">CampusLedger</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 700;">Welcome to CampusLedger!</h2>
          <p style="font-size: 16px; color: #475569;">Hello ${name},</p>
          <p style="font-size: 16px; color: #475569;">You have been invited by <strong>${institutionName}</strong> to join the CampusLedger network to receive digital, verifiable credentials.</p>
          <p style="font-size: 16px; color: #475569;">To accept this invitation and securely set up your account, please click the button below. This link will expire in 3 days.</p>
          
          <div style="${buttonWrapStyles}">
            <a href="${activationLink}" style="${buttonStyles}">Activate Account</a>
          </div>
          
          <p style="font-size: 16px; color: #475569; margin-bottom: 0;">If you did not expect this invitation, you can safely ignore this email.</p>
        </div>
        <div style="${footerStyles}">
          &copy; ${new Date().getFullYear()} CampusLedger. All rights reserved.<br/>
          Your secure digital identity wallet.
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to,
    subject: `You have been invited to CampusLedger by ${institutionName}`,
    html,
  });
}

export async function sendCredentialIssuedEmail(to: string, name: string, credentialTitle: string, institutionName: string) {
  const html = `
    <div style="${baseStyles}">
      <div style="${containerStyles}">
        <div style="${headerStyles}">
          <h1 style="${headerLogoStyles}">CampusLedger</h1>
        </div>
        <div style="${contentStyles}">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 700;">New Credential Issued</h2>
          <p style="font-size: 16px; color: #475569;">Hello ${name},</p>
          <p style="font-size: 16px; color: #475569;"><strong>${institutionName}</strong> has just issued a new verifiable credential to your decentralized wallet:</p>
          
          <div style="background: linear-gradient(to right, #eff6ff, #f8fafc); border: 1px solid #bfdbfe; padding: 20px; border-radius: 12px; margin: 24px 0; text-align: center;">
            <div style="font-size: 20px; font-weight: 700; color: #1e40af;">
              ${credentialTitle}
            </div>
            <div style="font-size: 14px; color: #3b82f6; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
              Verified Blockchain Record
            </div>
          </div>
          
          <p style="font-size: 16px; color: #475569;">You can view and cryptographically verify this credential by logging into your dashboard. From there, you can securely share it with employers or other institutions.</p>
          
          <div style="${buttonWrapStyles}">
            <a href="http://localhost:3000/student/login" style="${buttonStyles}">View Credential</a>
          </div>
        </div>
        <div style="${footerStyles}">
          &copy; ${new Date().getFullYear()} CampusLedger. All rights reserved.<br/>
          Secure verifiable credentials on the blockchain.
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to,
    subject: `🎓 New Credential Issued: ${credentialTitle}`,
    html,
  });
}
