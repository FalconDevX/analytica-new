"use client";
import ReactCountryFlag from "react-country-flag";
import ModeToggle from './modeToggle'

const Navbar = () => {
    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-center gap-8 sm:gap-4 backdrop-blur-lg bg-white/90 dark:bg-black/30 cursor-pointer"
        >
            <div onClick={() => { window.location.href = "/" }} className="hidden sm:flex w-1/3 pl-10 flex-row">
                <img src="/analytica_logo1-white.png" alt="logo" className="w-10 h-10 hidden dark:block" />
                <img src="/text-logo-white.png" alt="logo" className="w-auto h-10 pt-1 hidden dark:block" />

                <img src="/analytica_logo1-black.png" alt="logo" className="w-10 h-10 dark:hidden" />
                <img src="/text-logo-black.png" alt="logo" className="w-auto h-10 pt-1 block dark:hidden" />
            </div>
            <div className="sm:w-1/3 flex items-center justify-center gap-5">
                <a href="#home" className="text-black dark:text-white text-md cursor-pointer hover:text-gray-500 dark:hover:text-gray-200">Home</a>
                <a href="#about" className="text-black dark:text-white text-md cursor-pointer hover:text-gray-500 dark:hover:text-gray-200">About</a>
                <a href="#projects" className="text-black dark:text-white text-md cursor-pointer hover:text-gray-500 dark:hover:text-gray-200">Projects</a>
                <a href="#contact" className="text-black dark:text-white text-md cursor-pointer hover:text-gray-500 dark:hover:text-gray-200">Contact</a>
            </div>
            <div className="sm:w-1/3 flex flex-row items-center justify-end gap-4 sm:pr-10">
                <div className="flex gap-2">
                    <ReactCountryFlag countryCode="PL" svg className="w-6 h-6 border-black" />
                    <ReactCountryFlag countryCode="GB" svg className="w-6 h-6 border-black" />
                </div>

                <ModeToggle />
            </div>
        </div>
    )
}

export default Navbar