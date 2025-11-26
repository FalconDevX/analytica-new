"use client";
import React, { useState } from 'react'

const Contact = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log(username, email, message);
    }

    return (
        <div className='appear w-full min-h-[70vh] flex flex-col items-center'>
            <h1 className='text-2xl p-6'>Contact Us</h1>
            <h3 className="text-gray-400 mb-3">Interested in our projects? Get in touch with us using the form below:</h3>
            <form className="w-full max-w-xl flex flex-col gap-2">
                <input value={username} onChange={(e) => setUsername(e.target.value)} className="text-white focus:outline-none focus:border-white border-gray-400 border-2 rounded-none p-2" type="text" placeholder="Name" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="text-white focus:outline-none focus:border-white border-gray-400 border-2 rounded-none p-2" type="email" placeholder="Email" />
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-20 text-white focus:outline-none focus:border-white border-gray-400 border-2 rounded-none p-2 resize-none " placeholder="Message" />
                <button onClick={handleSubmit} type="submit" className="w-full border-2 border-gray-400 text-white bg-black px-4 py-2 transition-all duration-200 hover:bg-white hover:text-black hover:border-white cursor-pointer"
                >
                    Send
                </button>
            </form>
        </div>
    )
}

export default Contact;