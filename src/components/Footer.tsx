
import { Copyright } from "lucide-react";

export const Footer = () => (
  <footer className="w-full mt-8 flex flex-col items-center text-xs text-gray-400 pb-4">
    <div className="flex items-center gap-1">
      <Copyright size={14} className="inline" />
      <span>2025 Simon Kanyiva. All rights reserved.</span>
    </div>
    <span className="mt-1">
      <b>Breach Buster Toolkit™</b> is a product of <span className="font-semibold text-green-500">InvinsibleSKLabs</span>.
    </span>
  </footer>
);
