import Link from "next/link";
import Image from "next/image";
import { Facebook, Linkedin, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Explore", href: "/explore-us" },
  { label: "Research", href: "/research" },
  { label: "Gallery", href: "/gallery" },
];

const communityLinks = [
  { label: "Membership", href: "/membership" },
  { label: "Events", href: "/explore-us" },
  { label: "Committee", href: "/about-us" },
  { label: "Alumni", href: "/about-us" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

const socialLinks = [
  { href: "https://www.facebook.com/aicbubt", icon: Facebook, label: "Facebook" },
  { href: "https://www.linkedin.com/company/ai-community-bubt/", icon: Linkedin, label: "LinkedIn" },
  { href: "https://www.youtube.com/@aicommunitybubt", icon: Youtube, label: "YouTube" },
  { href: "https://chat.whatsapp.com/Lhs4NwTPjmaGdeplBuap35", icon: MessageCircle, label: "WhatsApp" },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-sm text-gray-300 transition hover:text-blue-400">
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 bg-blue-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <div className="flex items-start gap-4">
             
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white">Artificial Intelligence Community</h3>
                <p className="text-sm text-blue-200">Bangladesh University of Business & Technology (BUBT)</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-7 text-gray-300">
              A modern platform for community building, membership management, research sharing, and student-led AI collaboration at BUBT.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Community</h4>
            <div className="flex flex-col gap-3">
              {communityLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact & Social</h4>
            <div className="space-y-3 text-sm leading-7">
              <a className="block transition hover:text-blue-400" href="mailto:aicommunity@bubt.edu.bd">
                aicommunity@bubt.edu.bd
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-blue-300" />
                <span>Rupnagar, Mirpur-2, Dhaka-1216, Bangladesh</span>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    aria-label={item.label}
                    className="rounded-full border border-white/10 p-2 text-gray-300 transition hover:border-blue-400 hover:text-blue-400"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-300">© 2026 BUBT AI Community. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              {legalLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-gray-400">
            Developed by{" "}
            <a
              href="https://www.linkedin.com/in/masruf-rahman280/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Masruf Rahman
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
