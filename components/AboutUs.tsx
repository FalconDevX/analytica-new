"use client";

import React from "react";
import HorizontalReveal from "./HorizontalReveal";
import Reveal from "./Reveal";
import { MapIcon, ChartBarIcon, BrainIcon, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  {
    icon: <MapIcon className="w-6 h-6" />,
    title: "GIS",
    text: "Analizujemy dane geoprzestrzenne, warstwy GIS i ortofotomapy — budujemy inteligentne systemy rozumiejące przestrzeń.",
    side: "left",
    delay: 0.4,
  },
  {
    icon: <ChartBarIcon className="w-6 h-6" />,
    title: "Dane giełdowe",
    text: "Modelujemy rynki finansowe i tworzymy algorytmy inwestycyjne wspierane sztuczną inteligencją.",
    side: "right",
    delay: 0.8,
  },
  {
    icon: <BrainIcon className="w-6 h-6" />,
    title: "LLM & NLP",
    text: "Pracujemy z dużymi modelami językowymi - od interpretacji zapytań tekstowych po budowę własnych chatbotów.",
    side: "left",
    delay: 1.0,
  },
  {
    icon: <ImageIcon className="w-6 h-6" />,
    title: "Analiza obrazu",
    text: "Stosujemy computer vision do klasyfikacji, detekcji i segmentacji — od zdjęć satelitarnych po dane medyczne.",
    side: "right",
    delay: 1.4,
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col items-center relative">
      {/* <Reveal>
        <h1 className="text-xl relative inline-block pb-2 mb-12">
          About me
          <span className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-yellow-400 via-orange-500 to-pink-600"></span>
        </h1>
      </Reveal> */}

      <div className="relative w-full max-w-4xl flex flex-col">
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-neutral-400/50 origin-top"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {items.map((item, i) => (
          <div
            key={i}
            className={`w-full flex ${
              item.side === "right" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="w-1/2 mx-[-30px]">
              <HorizontalReveal
                delay={item.delay}
                direction={item.side === "right" ? "right" : "left"}
              >
                <div
                  className={
                    item.side === "right"
                      ? "flex justify-start items-center gap-2 mb-4"
                      : "flex justify-end items-center gap-2 mb-4"
                  }
                >
                  <h2 className="text-lg font-bold">{item.title}</h2>
                  <div className="dark:text-stone-400 text-stone-600 flex items-center justify-center w-10 h-10">
                    {item.icon}
                  </div>
                </div>

                <p
                  className={item.side === "right" ? "text-left" : "text-right"}
                >
                  {item.text}
                </p>
              </HorizontalReveal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
