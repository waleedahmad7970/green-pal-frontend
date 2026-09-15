import GPMark from "./GPMark";

export default function Footer() {
  return (
    <footer className="bg-ink text-sand py-16">
      <div className="container-edit">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 pb-12 border-b border-sand/15">
          <div className="flex items-center gap-3">
            <GPMark className="w-9 h-7 text-signal" />
            <span className="font-display font-extrabold text-2xl">GREENPAL</span>
          </div>
          <p className="font-body text-sand/55 max-w-sm text-sm leading-relaxed">
            A subsidiary of ANAH. Portable power solutions for airports, malls, and transit hubs —
            built on transparent pricing and fair treatment of every customer and partner.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-8 text-sm font-body text-sand/45">
          <p>© {new Date().getFullYear()} Greenpal. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-sand transition-colors">Instagram</a>
            <a href="#" className="hover:text-sand transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-sand transition-colors">thegreenpal.ca</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
