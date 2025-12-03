import React from 'react'
import { useTranslations } from "next-intl";

const About = () => {
  const t = useTranslations("about");
  return (
    <div id="about" className="appear w-full min-h-[60vh] flex flex-col items-center scroll-mt-15">
      <h1 className="text-black dark:text-white text-2xl p-6">{t("title")}</h1>
      <div className="flex flex-col md:flex-row gap-8 justify-center max-w-6xl mx-auto">
        <div className="w-full md:w-1/2 px-5 flex justify-center md:justify-end">
          <p className="dark:text-white text-black text-md max-w-xl whitespace-pre-line">{t("description")}</p>
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