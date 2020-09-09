import React, { useState } from "react";
import { Link } from "react-router-dom";

export default () => {
  const [state, setState] = useState({
    isNavOpen: false,
  });
  const navInnerClass = state.isNavOpen ? "w-full block" : "hidden";

  return (
    <nav
      className="flex items-center justify-between flex-wrap"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="flex items-center flex-shrink-0 text-gray mx-4 px-4">
        <Link className="font-bold text-2xl" to="/">
          dwata
        </Link>
      </div>

      <div className="block lg:hidden">
        <button className="flex items-center px-3 py-2 border rounded hover:bg-white">
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>

      <div className="block lg:inline-block lg:mt-0 p-4">&nbsp;</div>
      <div
        className={`${navInnerClass} flex-grow lg:block lg:flex lg:items-center lg:w-auto`}
      >
        <div className="lg:flex-grow">
          <Link
            className="block font-bold lg:inline-block lg:mt-0 hover:bg-white p-4"
            to="/pricing"
          >
            Pricing
          </Link>

          <Link
            className="block font-bold lg:inline-block lg:mt-0 hover:bg-white p-4"
            to="/blog"
          >
            Blog
          </Link>
        </div>

        <div>
          <a
            className="inline-block text-md px-3 py-1 rounded bg-blue-500 text-white font-bold hover:bg-blue-800 mr-6"
            href="https://demo.dwata.com"
          >
            <strong>Try now!</strong>
          </a>
        </div>
      </div>
    </nav>
  );
};
