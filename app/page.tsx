import ContactForm from "@/components/ContactForm";

const reasons = [
  "A real human replies, usually within hours.",
  "Pricing is upfront. No surprises later.",
  "No jargon needed. Just tell me what you want.",
];

const builds = [
  "online stores",
  "mobile apps",
  "internal dashboards",
  "WhatsApp and Sheets automation",
  "AI integrations",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line/70">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-5 md:px-12">
          <a
            href="#"
            className="inline-flex items-baseline gap-1.5 font-display text-[15px] font-semibold tracking-tightish text-ink"
          >
            Ridzone Leads
            <span
              aria-hidden
              className="inline-block h-[7px] w-[7px] translate-y-[-1px] rounded-[2px] bg-highlighter ring-1 ring-ink/10"
            />
          </a>
          <a
            href="#form"
            className="font-display text-[14px] font-medium text-ink underline-offset-4 hover:underline"
          >
            Jump to form
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-[1120px] px-6 pb-16 pt-14 md:px-12 md:pb-24 md:pt-20">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5 md:pt-4">
            <h1 className="font-display text-[40px] font-medium leading-[1.05] tracking-tightish text-ink md:text-[56px]">
              Got an idea?
              <br />
              Let&apos;s build it.
            </h1>
            <p className="mt-6 max-w-[42ch] font-body text-[17px] leading-[1.65] text-slate">
              I build websites, apps, automation, and AI integrations for
              anyone, not just big companies. Tell me what you have in mind
              and I&apos;ll reply within one business day.
            </p>

            <ul className="mt-8 space-y-3">
              {reasons.map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-3 font-body text-[16px] leading-relaxed text-ink"
                >
                  <span
                    aria-hidden
                    className="mt-[10px] inline-block h-[6px] w-[6px] flex-none rounded-full bg-cobalt"
                  />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div id="form" className="md:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="border-t border-line/60">
        <div className="mx-auto max-w-[1120px] px-6 py-10 md:px-12">
          <p className="font-body text-[15px] leading-relaxed text-slate">
            <span className="font-display text-ink">Things I usually build:</span>{" "}
            {builds.join(", ")}. If yours isn&apos;t on this list, send it
            anyway. I read every message.
          </p>
        </div>
      </section>

      <footer className="border-t border-line/60">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-2 px-6 py-8 text-[13px] text-slate md:flex-row md:items-center md:justify-between md:px-12">
          <span>© {new Date().getFullYear()} Ridzone Leads</span>
          <span>Replies from a human. Based in Indonesia.</span>
        </div>
      </footer>
    </main>
  );
}
