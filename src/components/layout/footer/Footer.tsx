import dynamic from "next/dynamic";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";


const FooterList = dynamic(() => import("./FooterList"), {
  loading: () => (
    <div className="animate-pulse bg-gray-700 h-96 rounded-lg w-full" />
  ),
});

const socialLinks = [
  {
    icon: FaFacebook,
    href: "https://facebook.com/collegepucho",
    label: "Facebook"
  },
  {
    icon: FaTwitter,
    href: "https://twitter.com/collegepucho",
    label: "Twitter"
  },
  {
    icon: FaInstagram,
    href: "https://instagram.com/collegepucho",
    label: "Instagram"
  },
  {
    icon: FaLinkedin,
    href: "https://linkedin.com/company/collegepucho",
    label: "LinkedIn"
  }
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-9 container-body">
      <FooterList />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 border-t border-gray-700">
        <h4 className="text-white text-4xl font-bold">collegepucho</h4>
        <div className="flex items-center gap-6">
          {socialLinks.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary-1 transition-colors"
              aria-label={social.label}
            >
              <social.icon size={24} />
            </Link>
          ))}
        </div>
        <p className="text-gray-400 text-sm">
          © {currentYear} collegepucho. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
