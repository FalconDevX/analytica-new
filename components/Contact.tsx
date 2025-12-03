"use client";
import React, { useState } from 'react'
import { useTranslations } from "next-intl";
const Contact = () => {
    const t = useTranslations("contact");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: username,
                email: email,
                message: message
            })
        });

        if (res.ok) {
            setStatus("Message sent!");
            setUsername("");
            setEmail("");
            setMessage("");
        } else {
            setStatus("Something went wrong.");
        }
    };

    return (
        <div id="contact" className="appear w-full min-h-[70vh] flex flex-col items-center px-5 md:px-0">
            <h1 className="text-2xl p-6 text-black dark:text-white">{t("title")}</h1>
            <h3 className="text-gray-900 dark:text-gray-400 mb-3">{t("subtitle")}</h3>
            <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-2">
                <input value={username} onChange={(e) => setUsername(e.target.value)} className="text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white border-gray-400 border-2 rounded-none p-2" type="text" placeholder={t("form.name")} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white border-gray-400 border-2 rounded-none p-2" type="email" placeholder={t("form.email")} />
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-20 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white border-gray-400 border-2 rounded-none p-2 resize-none " placeholder={t("form.message")} />
                <button type="submit" className="w-full border-2 focus:outline-none focus:border-black dark:focus:border-white border-gray-400 dark:border-gray-400 text-black dark:text-white bg-white dark:bg-black px-4 py-2 transition-all duration-200 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black hover:border-black cursor-pointer">
                    {t("form.send")}
                </button>
            </form>
            {status && <p className="text-black dark:text-white text-sm mt-2">{t("status.success") || t("status.error")}</p>}
        </div>
    )
}

export default Contact;