
import { Copyright } from "lucide-react";

export const Footer = () => (
  <footer className="w-full bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700 px-6 py-4">
    <div className="flex flex-col items-center text-xs text-gray-300">
      <div className="flex items-center gap-1 mb-1">
        <Copyright size={14} className="inline" />
        <span>2025 Simon Kanyiva. All rights reserved.</span>
      </div>
      <span className="text-gray-400">
        CyberPro Pro™ is a product of Breach Buster Toolkit Labs.
      </span>
    </div>
  </footer>
);
