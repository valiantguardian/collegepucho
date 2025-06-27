import dynamic from "next/dynamic";
// const NewsLetter = dynamic(() => import("./NewsLetter"));
const FooterList = dynamic(() => import("./FooterList"));

const Footer = () => {
  return (
    <footer className="bg-gray-9 container-body">
      {/* <NewsLetter /> */}
      <FooterList />
      <div className="flex justify-between items-center py-6 border-t border-gray-700">
        <h4 className="text-white text-4xl font-bold">collegepucho</h4>
        <p className="text-gray-400 text-sm">
          © 2025 collegepucho. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
