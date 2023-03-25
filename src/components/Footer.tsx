import React from "react";

function Footer() {
  const legalNotice = (
    <span className="self-center mt-6 opacity-70">&copy; 2022 Jon Lunde</span>
  );

  return (
    <footer className=" flex flex-col content-center mt-6 bg-primary-200 dark:bg-secondary-900 dark:text-gray-600 dark:opacity-100 w-full pt-4">
      <div className="flex justify-between self-center w-52">
        <a href="https://github.com/JonLunde/">GitHub</a>
        <div className="relative left-7">
          <a href="https://lunde.dev">Lunde.dev</a>
        </div>
      </div>
      {legalNotice}
    </footer>
  );
}

export default Footer;
