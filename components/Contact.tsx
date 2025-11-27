"use client";
import React, { useState } from 'react'

const Contact = () => {
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
            <h1 className="text-2xl p-6">Contact Us</h1>
            <h3 className="text-gray-400 mb-3">Interested in our projects? Get in touch with us using the form below:</h3>
            <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-2">
                <input value={username} onChange={(e) => setUsername(e.target.value)} className="text-white focus:outline-none focus:border-white border-gray-400 border-2 rounded-none p-2" type="text" placeholder="Name" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="text-white focus:outline-none focus:border-white border-gray-400 border-2 rounded-none p-2" type="email" placeholder="Email" />
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-20 text-white focus:outline-none focus:border-white border-gray-400 border-2 rounded-none p-2 resize-none " placeholder="Message" />
                <button type="submit" className="w-full border-2 focus:outline-none focus:border-white border-gray-400 text-white bg-black px-4 py-2 transition-all duration-200 hover:bg-white hover:text-black hover:border-white cursor-pointer">
                    Send
                </button>
            </form>
            {status && <p className="text-white text-sm mt-2">{status}</p>}
        </div>
    )
}

export default Contact;