import Image from "next/image";
import GPMark from "./GPMark";
import { lightLogo } from "@/public/icons";

export default function Footer() {
  return (
    <footer className="bg-ink text-sand py-16">
      <div className="container-edit">
        {/* Top Section: Brand & Link Columns */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 pb-12 border-b border-sand/15">
          {/* Brand & Contact Info */}
          <div className="flex flex-col gap-5 max-w-sm">
            <div className="flex items-center gap-3">
              <Image
                alt="Greenpal Logo"
                src={lightLogo}
                width={200}
                height={200}
              />
            </div>

            <p className="font-body text-sand/55 text-sm leading-relaxed">
              Shared Power. Anytime. Anywhere.
            </p>

            <div className="flex flex-col gap-1.5 font-body text-sm text-sand/55 mt-2">
              <a
                href="mailto:Info@TheGreenpal.ca"
                className="hover:text-sand transition-colors"
              >
                Info@TheGreenpal.ca
              </a>
              <a
                href="https://thegreenpal.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sand transition-colors"
              >
                thegreenpal.ca
              </a>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-12 sm:gap-24 lg:gap-32">
            {/* Explore Column */}
            <div className="flex flex-col gap-5">
              <h4 className="font-display font-semibold text-sand tracking-wide">
                Explore
              </h4>
              <nav className="flex flex-col gap-3 text-sm font-body text-sand/55">
                <a href="#" className="hover:text-sand transition-colors">
                  How It Works
                </a>
                <a href="#" className="hover:text-sand transition-colors">
                  For Venues
                </a>
                <a href="#" className="hover:text-sand transition-colors">
                  Power Portfolio Blueprints
                </a>
                <a href="#" className="hover:text-sand transition-colors">
                  FAQ
                </a>
              </nav>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col gap-5">
              <h4 className="font-display font-semibold text-sand tracking-wide">
                Legal
              </h4>
              <nav className="flex flex-col gap-3 text-sm font-body text-sand/55">
                <a href="#" className="hover:text-sand transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-sand transition-colors">
                  Terms of Use
                </a>
                <a href="#" className="hover:text-sand transition-colors">
                  Blueprint Purchase Terms
                </a>
                <a href="#" className="hover:text-sand transition-colors">
                  Digital Product Policy
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-8 text-sm font-body text-sand/45">
          <p>
            © {new Date().getFullYear()} Greenpal Canada Ltd. All rights
            reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-sand transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-sand transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
