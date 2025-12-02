import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

const {
  CONTACT_SMTP_HOST = "mail.cypadi.com",
  CONTACT_SMTP_PORT = "465",
  CONTACT_SMTP_USER = "info@cypadi.com",
  CONTACT_SMTP_PASS = "Cypadi@2030",
  CONTACT_SMTP_SECURE,
  CONTACT_NOTIFY_TO,
  CONTACT_BRAND_NAME = "Cypadi",
} = process.env;

const smtpPort = Number(CONTACT_SMTP_PORT);
const useSecure =
  CONTACT_SMTP_SECURE !== undefined
    ? CONTACT_SMTP_SECURE === "true"
    : smtpPort === 465;

const transporter = nodemailer.createTransport({
  host: CONTACT_SMTP_HOST,
  port: smtpPort,
  secure: useSecure,
  auth: {
    user: CONTACT_SMTP_USER,
    pass: CONTACT_SMTP_PASS,
  },
});

const escapeHtml = (str = "") =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildEmailTemplate = ({ name, email, message }) => {
  const formattedMessage = escapeHtml(message).replace(/\n/g, "<br />");

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${CONTACT_BRAND_NAME} – New Contact Message</title>
      <style>
        @media only screen and (max-width: 600px) {
          .card {
            width: 94% !important;
          }
          .content-padding {
            padding: 24px !important;
          }
          .chip-table td {
            display: block !important;
            width: 100% !important;
            margin-bottom: 12px !important;
          }
        }
      </style>
    </head>
    <body style="margin:0;background:#050505;font-family:'Segoe UI',Roboto,Arial,sans-serif;color:#f6f6f6;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(135deg,#030303,#1a1205);padding:36px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" class="card" cellspacing="0" cellpadding="0" style="max-width:600px;width:92%;border-radius:22px;background:linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));border:1px solid rgba(255,255,255,0.08);box-shadow:0 25px 70px rgba(0,0,0,0.45);overflow:hidden;">
              <tr>
                <td class="content-padding" style="padding:32px;background:radial-gradient(circle at top,rgba(255,210,96,0.28),transparent 65%);border-bottom:1px solid rgba(255,255,255,0.05);">
                  <h1 style="margin:0;font-size:26px;letter-spacing:0.5px;color:#ffd668;">New contact from ${escapeHtml(
                    name
                  )}</h1>
                  <p style="margin:10px 0 0;color:rgba(255,255,255,0.78);font-size:15px;">
                    Someone just submitted a message via ${CONTACT_BRAND_NAME}. Details below.
                  </p>
                </td>
              </tr>
              <tr>
                <td class="content-padding" style="padding:32px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="chip-table" style="margin-bottom:24px;">
                    <tr>
                      <td style="width:50%;padding:0 12px 0 0;vertical-align:top;">
                        <div style="padding:8px 0;">
                          <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.6px;color:rgba(255,255,255,0.6);margin-bottom:6px;">Sender</div>
                          <div style="font-size:17px;font-weight:600;color:#ffffff;word-break:break-word;word-wrap:break-word;overflow-wrap:anywhere;">${escapeHtml(
                            name
                          )}</div>
                        </div>
                      </td>
                      <td style="width:50%;padding:0 0 0 12px;vertical-align:top;">
                        <div style="padding:8px 0;">
                          <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.6px;color:rgba(255,255,255,0.6);margin-bottom:6px;">Email</div>
                          <div style="font-size:17px;font-weight:600;color:#ffffff;word-break:break-word;word-wrap:break-word;overflow-wrap:anywhere;">${escapeHtml(
                            email
                          )}</div>
                        </div>
                      </td>
                    </tr>
                  </table>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.08);border-radius:16px;">
                    <tr>
                      <td style="padding:22px;color:rgba(255,255,255,0.9);line-height:1.6;font-size:15px;word-break:break-word;word-wrap:break-word;overflow-wrap:anywhere;">
                        ${formattedMessage}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td class="content-padding" style="padding:24px 32px 34px;border-top:1px solid rgba(255,255,255,0.04);color:rgba(255,255,255,0.65);font-size:13px;line-height:1.5;">
                  <p style="margin:0 0 6px;">This email was automatically generated by the ${CONTACT_BRAND_NAME} website.</p>
                  <p style="margin:0;"><strong style="color:#ffd668;">Reply directly</strong> to this email to follow up with ${escapeHtml(
                    name
                  )}.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

router.post("/", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (
    !name ||
    !email ||
    !message ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide your name, email and message.",
    });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return res.status(422).json({
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  try {
    await transporter.sendMail({
      from: `"${CONTACT_BRAND_NAME} Website" <${CONTACT_SMTP_USER}>`,
      to: CONTACT_NOTIFY_TO || CONTACT_SMTP_USER,
      replyTo: `"${trimmedName}" <${trimmedEmail}>`,
      subject: `New contact message from ${trimmedName}`,
      text: `You have a new message from ${trimmedName} (${trimmedEmail}):\n\n${trimmedMessage}`,
      html: buildEmailTemplate({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
      }),
    });

    return res.json({
      success: true,
      message: "Thank you! Your message has been delivered to our inbox.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      message: "We couldn't send your message. Please try again later.",
    });
  }
});

export default router;

