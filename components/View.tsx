import React from "react"
import "./View.css"
import About from "./About"
import Projects from "./Projects"
import Recruitment from "./Recruitment"
import Contact from "./Contact"
import Footer from "./Footer"
const View = () => {
	return (
		<div className="bg-white dark:bg-black">
			<About />
			<Projects />
			<Recruitment />
			<Contact />
			<Footer />
		</div>
	)
}

export default View
