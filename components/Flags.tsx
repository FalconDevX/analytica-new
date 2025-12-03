"use client";

import { useRouter } from "next/navigation";

export default function Flags() {
  const router = useRouter();

  function setLang(locale: "pl" | "en") {
    document.cookie = `NEXT_LOCALE=${locale}; path=/;`;
    router.refresh(); 
  }

  return (
    <div className="flex gap-2 cursor-pointer">
      <img
        src="/PL.jpg"
        className="w-6 h-4"
        onClick={() => setLang("pl")}
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.9))" }}
        alt="PL"
      />
      <img
        src="/GB.jpg"
        className="w-6 h-4 drop-shadow-lg"
        onClick={() => setLang("en")}
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.9))" }}
        alt="EN"
      />
    </div>
  );
}
