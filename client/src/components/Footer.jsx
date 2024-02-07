import { Footer } from "flowbite-react";
import { BsFacebook, BsLinkedin, BsGithub } from "react-icons/bs";
export default function footer() {
  return (
    <Footer className="bg-white text-white rounded-none shadow-none border-t border-t-slate-300">
      <div className="container mx-auto max-w-[1480px] pl-8 pr-8">
        <div className="flex items-center justify-between py-8 pb-4">
          <Footer.Copyright href="#" by="Bloggy" year={new Date().getFullYear()} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsLinkedin} />
            <Footer.Icon href="#" icon={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
