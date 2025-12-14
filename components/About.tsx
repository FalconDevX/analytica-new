import React from 'react'
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Linkedin } from 'lucide-react';

const About = () => {
  const t = useTranslations("about");
  return (
    <div id="about" className="appear w-full min-h-[60vh] flex flex-col items-center scroll-mt-15">
      <h1 className="text-black dark:text-white text-2xl p-6">{t("title")}</h1>
      <div className="flex flex-col md:flex-row gap-8 justify-center max-w-6xl mx-auto">
        <div className="w-full md:w-1/2 px-5 flex flex-col md:justify-start">
          <p className="dark:text-white text-black text-md max-w-xl whitespace-pre-line">{t("description")}</p>
          <div className="flex flex-row gap-2">
            <a
              href="https://www.instagram.com/agh_analytica/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 mt-5 text-white transition-colors duration-300 hover:text-[#E1306C]"
            >
              <Instagram
                className="h-7 w-7 stroke-2 transition-all duration-300 
                /* Tutaj jest trik na 'gradientowy' cień: fioletowy cień wewnętrzny + pomarańczowy zewnętrzny */
                group-hover:drop-shadow-[0_0_8px_rgba(131,58,180,0.9)_drop-shadow(0_0_15px_rgba(253,29,29,0.6))]"
              />
            </a>

            <a
              href="https://www.facebook.com/p/AGH-Analytica-61569784207839/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 mt-5 text-white transition-colors duration-300 hover:text-[#5865F2]"
            >
              <Facebook
                className="h-7 w-7 stroke-2 transition-all duration-300 
                group-hover:drop-shadow-[0_0_10px_rgba(88,101,242,0.9)]"
              />
            </a>

            <a
              href="https://www.linkedin.com/company/agh-analytica/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 mt-5 text-white transition-colors duration-300 hover:text-[#0A66C2]"
            >
              <Linkedin
                className="h-7 w-7 stroke-2 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(10,102,194,0.9)]"
              />
            </a>

          </div>
        </div>
        
        <div className="w-full md:w-1/2 px-5">
          <div className="relative inline-block p-3">
            <img src="/ekipa.jpg" alt="About Us" className="h-auto w-auto object-contain object-top" />

            {/* górny lewy */}
            <span className="absolute top-0 left-0 w-[20px] h-[3px] bg-black dark:bg-white"></span>
            <span className="absolute top-0 left-0 w-[3px] h-[20px] bg-black dark:bg-white"></span>

            {/* dolny prawy */}
            <span className="absolute bottom-0 right-0 w-[20px] h-[3px] bg-black dark:bg-white"></span>
            <span className="absolute bottom-0 right-0 w-[3px] h-[20px] bg-black dark:bg-white"></span>

          </div>
        </div>
      </div>
    </div>
  )
}

export default About