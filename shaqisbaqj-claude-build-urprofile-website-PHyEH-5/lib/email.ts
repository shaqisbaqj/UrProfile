import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "UrProfile <hello@urprofile.co>";

function isConfigured() {
  return !!process.env.RESEND_API_KEY;
}

export async function sendBookingConfirmationEmail({
  name,
  email,
  tier,
  interviewUrl,
}: {
  name: string;
  email: string;
  tier: string;
  interviewUrl: string;
}) {
  if (!isConfigured()) return;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your shoot is confirmed — complete your story interview",
    html: `
<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1C1A18; padding: 40px 0;">
  <div style="border-top: 2px solid #C4622D; margin-bottom: 40px;"></div>
  <p style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #aaa; margin: 0 0 32px;">UrProfile</p>
  <h1 style="font-size: 36px; font-weight: 300; margin: 0 0 20px; line-height: 1.1;">Your shoot is confirmed, ${name}.</h1>
  <p style="font-size: 15px; line-height: 1.8; color: #555; margin: 0 0 20px;">
    Before we arrive, complete your story interview. It takes about 20 minutes and helps us show up knowing exactly how to capture who you are.
  </p>
  <p style="font-size: 15px; line-height: 1.8; color: #555; margin: 0 0 36px;">
    This isn't a form — it's a conversation. Our AI surfaces the emotional core of your story, your defining moment, what makes you different, and the exact language you use. Your creative director reviews it the night before your shoot.
  </p>
  <a href="${interviewUrl}" style="display: inline-block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C4622D; text-decoration: none; border: 1px solid #C4622D; padding: 14px 28px;">
    Complete My Interview &rarr;
  </a>
  <p style="font-size: 13px; color: #bbb; margin-top: 48px; padding-top: 24px; border-top: 1px solid #eee;">
    Tier: ${tier} &middot; Questions? <a href="mailto:hello@urprofile.co" style="color: #C4622D; text-decoration: none;">hello@urprofile.co</a>
  </p>
</div>
    `.trim(),
  });
}

export async function sendInterviewCompleteEmail({
  clientName,
  clientEmail,
  tier,
  storyBrief,
  scriptFramework,
  shotList,
  adminUrl,
}: {
  clientName: string;
  clientEmail: string;
  tier: string;
  storyBrief: string;
  scriptFramework: string;
  shotList: string[];
  adminUrl: string;
}) {
  if (!isConfigured()) return;

  const adminEmail = process.env.BOOKING_EMAIL || "hello@urprofile.co";
  const shotListHtml = shotList
    .map((s) => `<li style="margin-bottom: 10px; line-height: 1.6;">${s}</li>`)
    .join("");

  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `Interview complete — ${clientName} (${tier})`,
    html: `
<div style="font-family: Georgia, serif; max-width: 680px; margin: 0 auto; color: #1C1A18; padding: 40px 0;">
  <div style="border-top: 2px solid #C4622D; margin-bottom: 40px;"></div>
  <p style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #C4622D; margin: 0 0 8px;">Story Interview Complete</p>
  <h1 style="font-size: 32px; font-weight: 300; margin: 0 0 8px;">${clientName}</h1>
  <p style="font-size: 13px; color: #999; margin: 0 0 48px;">${clientEmail} &middot; ${tier}</p>

  <h2 style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C4622D; margin: 0 0 16px; border-bottom: 1px solid #eee; padding-bottom: 12px;">Story Brief</h2>
  <p style="font-size: 15px; line-height: 1.9; color: #333; margin: 0 0 48px; white-space: pre-wrap;">${storyBrief}</p>

  <h2 style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C4622D; margin: 0 0 16px; border-bottom: 1px solid #eee; padding-bottom: 12px;">Script Framework</h2>
  <p style="font-size: 15px; line-height: 1.9; color: #333; margin: 0 0 48px; white-space: pre-wrap;">${scriptFramework}</p>

  <h2 style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C4622D; margin: 0 0 16px; border-bottom: 1px solid #eee; padding-bottom: 12px;">Shot List</h2>
  <ul style="font-size: 15px; color: #333; margin: 0 0 48px; padding-left: 20px;">
    ${shotListHtml}
  </ul>

  <a href="${adminUrl}" style="display: inline-block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C4622D; text-decoration: none; border: 1px solid #C4622D; padding: 14px 28px;">
    View Full Interview &rarr;
  </a>
</div>
    `.trim(),
  });
}
