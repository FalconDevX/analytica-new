import React from 'react'

const Footer = () => {
    return (
        <div className="flex flex-col appear-footer w-full h-20 text-center">
            <h1>© 2025 AGH Analytica</h1>
            <a
                href="/Regulamin.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-gray-400 hover:text-white"
            >
                Regulamin
            </a>    
        </div>
        
    )
}

export default Footer