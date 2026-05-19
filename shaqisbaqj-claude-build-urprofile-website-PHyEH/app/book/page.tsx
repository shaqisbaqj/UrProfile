import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Book Your Profile — UrProfile",
  description:
    "Book your premium concierge video profile. One shoot. One edit. One link.",
};

async function submitBooking(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  "use server";

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = (formData.get("phone") as string) || "—";
  const industry = (formData.get("industry") as string) || "—";
  const message = (formData.get("message") as string) || "—";

  if (!name || !email) {
    return { success: false, error: "Name and email are required." };
  }

  const resendKey = process.env.RESEND_API_KEY;
  const bookingEmail = process.env.BOOKING_EMAIL;

  if (resendKey && bookingEmail) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);

      await resend.emails.send({
        from: "UrProfile Bookings <bookings@urprofile.com>",
        to: bookingEmail,
        subject: `New UrProfile booking request from ${name}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; color: #1C1A18;">
            <h2 style="color: #C4622D;">New Booking Request</h2>
            <table style="width:100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #E0D4C0;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E0D4C0;">${name}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #E0D4C0;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E0D4C0;">${email}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #E0D4C0;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E0D4C0;">${phone}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #E0D4C0;"><strong>Industry:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E0D4C0;">${industry}</td></tr>
              <tr><td style="padding: 8px 0;" colspan="2"><strong>Message:</strong><br/>${message}</td></tr>
            </table>
          </div>
        `,
      });
    } catch (err) {
      console.error("Failed to send booking email:", err);
      // Don't fail the user — booking still counted
    }
  } else {
    // Log to console when Resend is not configured
    console.log("=== New UrProfile Booking Request ===");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Industry:", industry);
    console.log("Message:", message);
    console.log("=====================================");
  }

  return { success: true };
}

export default function BookPage() {
  return (
    <>
      <Nav />

      <main className="pt-32 pb-28 px-6 min-h-screen bg-cream">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <span className="divider block mb-10" />
          <h1 className="font-display text-6xl sm:text-7xl font-light text-dark mb-6 leading-tight">
            Let&apos;s make
            <br />
            <em className="text-ember">your profile.</em>
          </h1>
          <p className="font-body text-dark/60 text-lg leading-relaxed mb-16">
            Fill in the form below and we&apos;ll be in touch within 24 hours to
            schedule your shoot and walk you through everything.
          </p>

          <BookingForm action={submitBooking} />

          {/* What happens next */}
          <div className="mt-20 pt-12 border-t border-linen">
            <h2 className="font-display text-3xl font-light text-dark mb-8">
              What happens next
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  text: "We review your request and reach out within 24 hours.",
                },
                {
                  step: "02",
                  text: "A brief intro call to align on your story and shooting location.",
                },
                {
                  step: "03",
                  text: "We schedule the shoot — usually within 2 weeks.",
                },
                {
                  step: "04",
                  text: "Your profile goes live within 5 business days of the shoot.",
                },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-5">
                  <span className="font-display text-2xl font-light text-ember/40 shrink-0 w-8">
                    {step}
                  </span>
                  <p className="font-body text-dark/70 leading-relaxed pt-0.5">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-dark border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-display text-xl text-cream/60 tracking-wide">
            UrProfile
          </p>
          <p className="font-body text-xs text-cream/30 tracking-widest uppercase">
            &copy; {new Date().getFullYear()} UrProfile. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
