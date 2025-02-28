import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Layanan", path: "/Layanan" },
    { name: "Metode", path: "/Metode" },
    { name: "Profil", path: "/Profil" },
    { name: "Artikel", path: "/Artikel" },
    { name: "Galeri", path: "/Galeri" },
    { name: "Kontak", path: "/Kontak" },
  ];

  const handleMenuItemClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <header className="container mx-auto lg:mt-4 lg:mb-8">
      <nav className="flex justify-between items-center w-full max-w-screen-2xl mx-auto mt-5 p-2 md:p-0">
        <div className="ml-0 md:ml-2 lg:ml-5 z-20">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dtpxp4yjv/image/upload/v1734639559/products/jg5remlsiqixehj38tp0.png"
              alt="SunMod Logo"
              className="h-10 sm:h-11 md:h-12 lg:h-14 xl:h-16 w-auto"
            />
          </Link>
        </div>

        <div
          className={`z-10 absolute md:relative top-16 md:top-auto right-0 bg-white md:bg-transparent w-full md:w-auto shadow-md md:shadow-none md:px-8 lg:px-10 rounded-sm md:space-x-4 lg:space-x-6 xl:space-x-9 
          ${
            isOpen ? "flex flex-col items-center space-y-4 text-lg py-6" : "hidden"
          } md:flex md:flex-row md:space-y-0 md:items-center md:text-base`}
        >
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item-path block md:inline-block text-custom-black hover:text-custom-blue transition duration-300 text-xl md:text-lg lg:text-2xl relative 
                ${location.pathname === item.path ? "text-custom-blue" : "text-custom-black"} 
                `}
              onClick={handleMenuItemClick}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-custom-black">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
