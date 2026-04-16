import React from "react"
import "./View.css"
import About from "./about/About"
import Projects from "./projects/Projects"
import Recruitment from "./recruitment/Recruitment"
import Contact from "./contact/Contact"
import Footer from "@/components/layout/Footer"
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
