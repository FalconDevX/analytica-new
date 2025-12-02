import React from 'react'
import './View.css'
import About from './About'
import Projects from './Projects'
import Contact from './Contact'
import Footer from './Footer'
const View = () => {
    return (
        <div className="bg-white dark:bg-black">
            <About />
            <Projects />
            <Contact />
            <Footer />
        </div>
    )
}

export default View