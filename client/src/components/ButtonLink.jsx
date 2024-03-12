import React from "react";
import { Link } from "react-router-dom";

export default function ButtonLink({ url }) {
  return (
    <Link
      to={url}
      className="flex items-center justify-center px-4 py-2 font-semibold text-white rounded-full text-sm bg-gradient-to-r from-orange-500 to-pink-500 hover:from-pink-600 hover:to-orange-600"
    >
      View All
    </Link>
  );
}
