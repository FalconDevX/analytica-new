"use client";
import useTilt from "@/hooks/useTilt";
import { useTranslations } from "next-intl";
const Projects = () => {
    useTilt();
    const t = useTranslations("projects");
    return (
        <div id = "projects" className="appear w-full min-h-[90vh] flex flex-col items-center justify-start scroll-mt-20">
            <h1 className="text-2xl p-6">{t("title")}</h1>
            <div className="flex flex-col md:flex-row gap-5">
                <div className="max-w-xl">
                    <h3 className="text-black dark:text-white text-lg p-3" >{t("developersChat.title")}</h3>
                    <div className="relative inline-block p-3" data-tilt suppressHydrationWarning>
                        <img 
                            src="project-geo.png"
                            className="w-full h-auto object-contain"
                            data-tilt data-tilt-max="20" suppressHydrationWarning
                        />
                        {/* górny lewy */}
                        <span className="absolute top-0 left-0 w-[20px] h-[3px] bg-black dark:bg-white"></span>
                        <span className="absolute top-0 left-0 w-[3px] h-[20px] bg-black dark:bg-white"></span>

                        {/* dolny prawy */}
                        <span className="absolute bottom-0 right-0 w-[20px] h-[3px] bg-black dark:bg-white"></span>
                        <span className="absolute bottom-0 right-0 w-[3px] h-[20px] bg-black dark:bg-white"></span>
                    </div>

                    <p className="text-black dark:text-white text-md p-3 whitespace-pre-line">{t("developersChat.description")}</p>
                </div>
                <div className="max-w-xl">
                    <h3 className="text-black dark:text-white text-lg p-3">{t("tradeAnalysis.title")}</h3>
                    <div className="relative inline-block p-3" data-tilt suppressHydrationWarning>

                        <img
                            src="project-trade.png"
                            className="w-full h-auto object-contain"
                            data-tilt data-tilt-max="20" suppressHydrationWarning
                        />

                        {/* górny lewy */}
                        <span className="absolute top-0 left-0 w-[20px] h-[3px] bg-black dark:bg-white"></span>
                        <span className="absolute top-0 left-0 w-[3px] h-[20px] bg-black dark:bg-white"></span>

                        {/* dolny prawy */}
                        <span className="absolute bottom-0 right-0 w-[20px] h-[3px] bg-black dark:bg-white"></span>
                        <span className="absolute bottom-0 right-0 w-[3px] h-[20px] bg-black dark:bg-white"></span>
                    </div>

                    <p className="text-black dark:text-white text-md p-3 whitespace-pre-line">{t("tradeAnalysis.description")}</p>
                </div>
            </div>
        </div>
    )
}

export default Projects