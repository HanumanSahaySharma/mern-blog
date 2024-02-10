import { Footer } from "flowbite-react";
import { BsFacebook, BsLinkedin, BsGithub } from "react-icons/bs";
export default function footer() {
  return (
    <Footer className="bg-white rounded-none shadow-none border-t border-t-slate-300 dark:bg-gray-800 dark:border-t-gray-700">
      <div className="container mx-auto max-w-[1480px] pl-8 pr-8">
        <div className="flex items-center justify-between py-8">
          <Footer.Copyright href="#" by="Bloggy" year={new Date().getFullYear()} className="dark:text-slate-200" />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} className="dark:text-slate-200" />
            <Footer.Icon href="#" icon={BsLinkedin} className="dark:text-slate-200" />
            <Footer.Icon href="#" icon={BsGithub} className="dark:text-slate-200" />
          </div>
        </div>
      </div>
    </Footer>
  );
}
