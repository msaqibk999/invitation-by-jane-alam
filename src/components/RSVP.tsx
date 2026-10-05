import { useState } from "react";
import { Users, Heart, CheckCircle } from "lucide-react";
import { wedding } from "../data/wedding";

export function RSVP() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sending) return;

    setSending(true);

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${wedding.rsvpEmail}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            Name: name,
            Attendance: attendance === "yes" ? "Yes" : "No",
            Message: message || "No message provided",

            _subject: `Wedding RSVP - ${name}`,
            _captcha: "false",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send RSVP");
      }

      setSent(true);
    } catch (error) {
      console.error("RSVP submission failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <Heart
            className="mx-auto text-[var(--primary)] mb-3"
            fill="currentColor"
            size={32}
          />

          <h2 className="font-calligraphy text-6xl md:text-7xl text-[var(--primary)]">
            RSVP
          </h2>

          <p className="text-sm md:text-4xl text-[var(--muted)] mt-2">
            We would love to celebrate with you
          </p>
        </div>

        {sent ? (
          /* Success */
          <div className="rounded-2xl bg-[var(--primary)] text-white p-7 md:px-16 md:py-12 text-center mt-14 shadow-gold">
            <CheckCircle className="mx-auto mb-2" size={40} />

            <h3 className="font-calligraphy text-7xl md:text-6xl leading-relaxed">
              Thank you, {name || "dear guest"}!
            </h3>

            <p className="mt-6 text-sm md:text-3xl opacity-90 leading-relaxed">
              Your response has been received. We look forward to celebrating
              with you!
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={submit} className="space-y-5 mt-14">
            {/* Name */}
            <label className="block text-sm md:text-3xl font-medium">
              Your Name
              <span className="text-red-500 ml-1">*</span>

              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="
                  mt-4
                  w-full
                  h-24
                  rounded-lg
                  border border-[var(--border)]
                  bg-white
                  px-4
                  text-3xl
                  outline-none
                  focus:border-[var(--primary)]
                  focus:ring-1
                  focus:ring-[var(--primary)]
                  transition
                "
              />
            </label>

            {/* Attendance */}
            <label className="block text-sm md:text-3xl font-medium">
              <span className="flex items-center gap-2">
                <Users size={17} />
                Will you be attending?
                <span className="text-red-500">*</span>
              </span>

              <select
                required
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                className="
                  mt-4
                  w-full
                  h-24
                  rounded-lg
                  border border-[var(--border)]
                  bg-white
                  px-4
                  text-3xl
                  outline-none
                  focus:border-[var(--primary)]
                  focus:ring-1
                  focus:ring-[var(--primary)]
                  transition
                "
              >
                <option value="">Select...</option>
                <option value="yes">Yes, I'll be there!</option>
                <option value="no">Sorry, I can't make it</option>
              </select>
            </label>

            {/* Message */}
            <label className="block text-sm md:text-3xl font-medium">
              Your Message

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write your wishes..."
                className="
                  mt-4
                  w-full
                  rounded-lg
                  border border-[var(--border)]
                  bg-white
                  px-4
                  py-3
                  text-3xl
                  leading-relaxed
                  outline-none
                  resize-none
                  focus:border-[var(--primary)]
                  focus:ring-1
                  focus:ring-[var(--primary)]
                  transition
                "
              />
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={sending}
              className="
                w-full
                h-24
                rounded-lg
                bg-[var(--primary)]
                text-white
                text-3xl
                font-medium
                shadow-gold
                transition
                active:scale-[0.98]
                disabled:opacity-60
                disabled:cursor-not-allowed
                mt-4
              "
            >
              {sending ? "Sending..." : "Send RSVP"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}