"use client";
import { useTranslations } from "next-intl";
import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import ModeToggle from "./modeToggle";
import Flags from "./Flags";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { NavbarSectionIndicator } from "./NavbarSectionIndicator";

const navLinkBase =
  "relative inline-block px-4 py-2 rounded-lg transition-all duration-300 text-md cursor-pointer whitespace-nowrap text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10";

const navLinkClassDesktop = (activeSection: string, section: string) =>
  `${navLinkBase} ${
    activeSection === section
      ? "font-medium text-black dark:text-white"
      : "opacity-70 hover:opacity-100"
  }`;

const navLinkClassMobile = (activeSection: string, section: string) =>
  `inline-block px-4 py-2 rounded-lg transition-all duration-300 text-md cursor-pointer whitespace-nowrap ${
    activeSection === section
      ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
      : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
  }`;

const Navbar = () => {
  const t = useTranslations("navbar");
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const navShellRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);

  const updateIndicator = useCallback(() => {
    const shell = navShellRef.current;
    const parent = desktopNavRef.current;
    if (!shell || !parent) return;
    const el = parent.querySelector<HTMLAnchorElement>(
      `a[href="#${activeSection}"]`,
    );
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const shellRect = shell.getBoundingClientRect();
    setIndicator({
      left: rect.left - shellRect.left,
      width: rect.width,
    });
  }, [activeSection]);

  useLayoutEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const sections = ["home", "about", "projects", "contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
  return (
    <div ref={navShellRef} className="fixed top-0 left-0 right-0 z-50 h-16">
      <NavbarSectionIndicator
        left={indicator.left}
        width={indicator.width}
        className="hidden md:block"
      />
      <div
        className="pointer-events-none absolute inset-0 z-1 bg-white/30 backdrop-blur-lg dark:bg-black/30"
        aria-hidden
      />
      <div className="relative z-10 flex h-full w-full items-center justify-center gap-8 sm:gap-4">
        <div
          onClick={() => {
            window.location.href = "/";
          }}
          className="flex w-full md:w-1/3 flex-row pl-3 md:pl-10"
        >
          <img
            src="/analytica_logo1-white.png"
            alt="logo"
            className="w-10 h-10 hidden dark:block object-cover"
          />
          <img
            src="/text-logo-white.png"
            alt="logo"
            className="w-auto h-10 pt-1 hidden dark:block object-cover"
          />

          <img
            src="/analytica_logo1-black.png"
            alt="logo"
            className="w-10 h-10 dark:hidden object-cover"
          />
          <img
            src="/text-logo-black.png"
            alt="logo"
            className="w-auto h-10 pt-1 block dark:hidden object-cover"
          />
        </div>
        <div
          ref={desktopNavRef}
          className="relative hidden md:flex md:w-1/3 items-center justify-center gap-2"
        >
          <a
            href="#home"
            className={navLinkClassDesktop(activeSection, "home")}
          >
            {t("home")}
          </a>
          <a
            href="#about"
            className={navLinkClassDesktop(activeSection, "about")}
          >
            {t("about")}
          </a>
          <a
            href="#projects"
            className={navLinkClassDesktop(activeSection, "projects")}
          >
            {t("projects")}
          </a>
          <a
            href="#contact"
            className={navLinkClassDesktop(activeSection, "contact")}
          >
            {t("contact")}
          </a>
        </div>

        <div className="flex w-full cursor-default flex-row items-center justify-end gap-4 pr-3 md:pr-10 md:w-1/3">
          <Flags />

          <ModeToggle />

          <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button className="md:hidden w-10 h-10 cursor-pointer">
                <MenuIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className={navLinkClassMobile(activeSection, "home")}
                onClick={() => (window.location.href = "/")}
              >
                {t("home")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={navLinkClassMobile(activeSection, "about")}
                onClick={() => (window.location.href = "/#about")}
              >
                {t("about")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={navLinkClassMobile(activeSection, "projects")}
                onClick={() => (window.location.href = "/#projects")}
              >
                {t("projects")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={navLinkClassMobile(activeSection, "contact")}
                onClick={() => (window.location.href = "/#contact")}
              >
                {t("contact")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
