"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import ModeToggle from './modeToggle'
import Flags from './Flags'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
    const t = useTranslations("navbar");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-center gap-8 sm:gap-4 backdrop-blur-lg bg-white/90 dark:bg-black/30"
        >
            <div onClick={() => { window.location.href = "/" }} className="flex w-full md:w-1/3 pl-3 md:pl-10 flex-row">
                <img src="/analytica_logo1-white.png" alt="logo" className="w-10 h-10 hidden dark:block object-cover" />
                <img src="/text-logo-white.png" alt="logo" className="w-auto h-10 pt-1 hidden dark:block object-cover" />

                <img src="/analytica_logo1-black.png" alt="logo" className="w-10 h-10 dark:hidden object-cover" />
                <img src="/text-logo-black.png" alt="logo" className="w-auto h-10 pt-1 block dark:hidden object-cover" />
            </div>
            <div className="hidden md:flex md:w-1/3 items-center justify-center gap-5">
                <a href="#home" className="text-black dark:text-white text-md cursor-pointer hover:text-gray-500 dark:hover:text-gray-200 whitespace-nowrap">{t("home")}</a>
                <a href="#about" className="text-black dark:text-white text-md cursor-pointer hover:text-gray-500 dark:hover:text-gray-200 whitespace-nowrap">{t("about")}</a>
                <a href="#projects" className="text-black dark:text-white text-md cursor-pointer hover:text-gray-500 dark:hover:text-gray-200 whitespace-nowrap">{t("projects")}</a>
                <a href="#contact" className="text-black dark:text-white text-md cursor-pointer hover:text-gray-500 dark:hover:text-gray-200 whitespace-nowrap">{t("contact")}</a>
            </div>

            <div className="w-full md:w-1/3 flex flex-row items-center justify-end gap-4 pr-3 md:pr-10 cursor-default">
                <Flags />

                <ModeToggle />

                <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button className="md:hidden w-10 h-10 cursor-pointer">
                            <MenuIcon className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = "/"}>{t("home")}</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = "/#about"}>{t("about")}</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = "/#projects"}>{t("projects")}</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = "/#contact"}>{t("contact")}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    )
}

export default Navbar