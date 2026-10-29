import Image from "next/image";
import { chargedPowerBank, rentPowerBank, returnPowerBank, scanPowerBank } from "@/public/howitworks";

const steps = [
  {
    id: 1,
    title: "Tap / Scan",
    description: "Scan the QR code on any Greenpal Pulse station.",
    image: scanPowerBank,
  },
  {
    id: 2,
    title: "Rent",
    description: "Pick up a portable power bank. Pay by the hour.",
    image: rentPowerBank,
  },
  {
    id: 3,
    title: "Charge",
    description: "Charge your phone anywhere. Keep moving.",
    image: chargedPowerBank,
  },
  {
    id: 4,
    title: "Return",
    description: "Drop it at any Greenpal station when you're done.",
    image: returnPowerBank,
  },
];

// Hairline dividers between the steps:
// mobile + tablet = 2x2 grid, desktop = one row of 4.
const dividers = [
  "",
  "border-l",
  "border-t lg:border-t-0 lg:border-l",
  "border-t border-l lg:border-t-0",
];

export default function HowItWorks() {
  return (
    <section className="relative py-16 md:py-24 bg-surface">
      <div className="container-edit">
        {/* One single light band holding all four steps */}
        <div className="relative overflow-hidden rounded-[2rem] bg-card text-ink border border-signal/60 ">
          {/* Soft glow behind the band */}
          {/* <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, rgba(2,214,131,0.10) 0%, rgba(2,214,131,0) 70%)",
            }}
          /> */}

          {/* Header */}
          <div className="relative px-6 pt-12 pb-10 md:px-12 md:pt-16 md:pb-14 text-center">
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-ink leading-[1.04] mb-3">
              How It Works
            </h2>
            <p className="font-body text-lg md:text-xl text-muted">
              Stay powered up while on the go.
            </p>
          </div>

          {/* Four steps: 2 rows on mobile, 1 row on desktop */}
          <ol className="relative grid grid-cols-2 lg:grid-cols-4 border-t line-rule">
            {steps.map((step, i) => (
              <li
                key={step.id}
                className={`relative flex flex-col px-4 pt-4 pb-6 md:px-6 md:pt-5 md:pb-8 line-rule ${dividers[i]}`}
              >
                {/* Big number */}
                <span
                  aria-hidden="true"
                  className="font-display font-extrabold text-5xl md:text-8xl leading-none text-signal mb-3 md:mb-4 select-none"
                >
                  0{step.id}
                </span>

                {/* Image */}
                <div className="relative aspect-[4/5] w-full mb-4 md:mb-6 overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover object-center"
                  />
                </div>

                {/* Text */}
                <h3 className="font-display font-extrabold text-lg md:text-3xl tracking-tight text-ink mb-2 md:mb-3">
                  {step.title}
                </h3>
                <p className="font-body text-xs md:text-base leading-relaxed text-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}