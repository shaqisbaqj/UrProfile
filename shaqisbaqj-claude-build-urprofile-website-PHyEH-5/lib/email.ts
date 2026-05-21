import { Resend } from "resend";

const FROM = "UrProfile <hello@urprofile.co>";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
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
  const resend = getResend();
  if (!resend) return;

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
    ${tier} &middot; Questions? <a href="mailto:hello@urprofile.co" style="color: #C4622D; text-decoration: none;">hello@urprofile.co</a>
  </p>
</div>`.trim(),
  });
}

export async function sendWelcomeEmail({
  name,
  email,
  portalUrl,
  passwordSetupUrl,
}: {
  name: string;
  email: string;
  portalUrl: string;
  passwordSetupUrl: string;
}) {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to UrProfile — set up your account",
    html: `
<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1C1A18; padding: 40px 0;">
  <div style="border-top: 2px solid #C4622D; margin-bottom: 40px;"></div>
  <p style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #aaa; margin: 0 0 32px;">UrProfile</p>
  <h1 style="font-size: 36px; font-weight: 300; margin: 0 0 20px; line-height: 1.1;">Welcome, ${name}.</h1>
  <p style="font-size: 15px; line-height: 1.8; color: #555; margin: 0 0 20px;">
    Your booking is confirmed. We'll be in touch within 24 hours to schedule your shoot.
  </p>
  <p style="font-size: 15px; line-height: 1.8; color: #555; margin: 0 0 36px;">
    In the meantime, set up your account password to access your client portal — where you'll track your production status, message our team, and see your profile when it's ready.
  </p>
  <a href="${passwordSetupUrl}" style="display: inline-block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C4622D; text-decoration: none; border: 1px solid #C4622D; padding: 14px 28px; margin-bottom: 16px;">
    Set Up My Account &rarr;
  </a>
  <p style="font-size: 13px; color: #bbb; margin-top: 8px;">
    Or go directly to your portal: <a href="${portalUrl}" style="color: #C4622D; text-decoration: none;">${portalUrl}</a>
  </p>
  <p style="font-size: 13px; color: #bbb; margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee;">
    Questions? <a href="mailto:hello@urprofile.co" style="color: #C4622D; text-decoration: none;">hello@urprofile.co</a>
  </p>
</div>`.trim(),
  });
}

const STATUS_SUBJECTS: Record<string, string> = {
  "shoot-scheduled":  "Your shoot is scheduled",
  "shoot-complete":   "Your shoot is done — we're editing your film",
  "in-editing":       "Your profile film is in editing",
  "review-ready":     "Your profile is ready to review",
  "live":             "Your profile is live",
  "nfc-shipped":      "Your NFC cards are on the way",
};

const STATUS_BODIES: Record<string, string> = {
  "shoot-scheduled":  "Great news — your shoot is officially on the calendar. We'll reach out with full details soon.",
  "shoot-complete":   "Your shoot went great. We're now editing your profile film. Expect it to be ready within 5–7 business days.",
  "in-editing":       "Your film is in post-production — color grading, sound design, the works. We'll notify you as soon as it's ready for review.",
  "review-ready":     "Your profile film is ready. Log in to your portal to review it and let us know what you think.",
  "live":             "Your UrProfile page is live. Share your link — every first impression from here is yours to control.",
  "nfc-shipped":      "Your NFC cards have shipped. Tap one on any smartphone to open your profile instantly.",
};

export async function sendStatusUpdateEmail({
  name,
  email,
  status,
  portalUrl,
}: {
  name: string;
  email: string;
  status: string;
  portalUrl: string;
}) {
  const resend = getResend();
  if (!resend) return;

  const subject = STATUS_SUBJECTS[status];
  const body = STATUS_BODIES[status];
  if (!subject || !body) return;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject,
    html: `
<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1C1A18; padding: 40px 0;">
  <div style="border-top: 2px solid #C4622D; margin-bottom: 40px;"></div>
  <p style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #aaa; margin: 0 0 32px;">UrProfile</p>
  <h1 style="font-size: 32px; font-weight: 300; margin: 0 0 20px; line-height: 1.1;">${subject}.</h1>
  <p style="font-size: 15px; line-height: 1.8; color: #555; margin: 0 0 36px;">${body}</p>
  <a href="${portalUrl}" style="display: inline-block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C4622D; text-decoration: none; border: 1px solid #C4622D; padding: 14px 28px;">
    View My Portal &rarr;
  </a>
  <p style="font-size: 13px; color: #bbb; margin-top: 48px; padding-top: 24px; border-top: 1px solid #eee;">
    Questions? <a href="mailto:hello@urprofile.co" style="color: #C4622D; text-decoration: none;">hello@urprofile.co</a>
  </p>
</div>`.trim(),
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
  const resend = getResend();
  if (!resend) return;

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
  <ul style="font-size: 15px; color: #333; margin: 0 0 48px; padding-left: 20px;">${shotListHtml}</ul>
  <a href="${adminUrl}" style="display: inline-block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C4622D; text-decoration: none; border: 1px solid #C4622D; padding: 14px 28px;">
    View Full Interview &rarr;
  </a>
</div>`.trim(),
  });
}
