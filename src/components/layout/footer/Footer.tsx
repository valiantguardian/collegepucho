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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 py-4 sm:py-6 border-t border-gray-700">
        <h4 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left">
          collegepucho
        </h4>
        <div className="flex items-center gap-4 sm:gap-6 order-2 sm:order-1">
          {socialLinks.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary-1 transition-colors p-2 hover:bg-gray-800 rounded-lg"
              aria-label={social.label}
            >
              <social.icon size={20} className="sm:w-6 sm:h-6" />
            </Link>
          ))}
        </div>
        <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-right order-1 sm:order-2">
          © {currentYear} collegepucho. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
