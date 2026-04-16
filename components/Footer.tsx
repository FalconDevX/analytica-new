import React from "react"

const Footer = () => {
	return (
		<footer className="flex flex-col appear-footer w-full min-h-20 items-center justify-center gap-1 py-4 text-center">
			<p className="text-sm text-black dark:text-white">© 2026 AGH Analytica</p>
			<a
				href="/Regulamin.pdf"
				target="_blank"
				rel="noopener noreferrer"
				className="inline-flex min-h-11 items-center px-2 text-sm underline text-gray-700 hover:text-black dark:text-gray-400 dark:hover:text-white"
			>
				Regulamin
			</a>
		</footer>
	)
}

export default Footer
