import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-white py-8 border border-b-0 border-l-0 border-r-0 border-t-slate-300">
      <div className="container mx-auto max-w-[1480px] pl-8 pr-8">
        <p className="text-center">&copy; {new Date().getFullYear()}. All right reserved.</p>
      </div>
    </footer>
  );
}
