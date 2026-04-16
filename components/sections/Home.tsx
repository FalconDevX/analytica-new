import View from "./View"
import Welcome from "./welcome/Welcome"
import Navbar from "@/components/layout/Navbar"

const Home = () => {
	return (
		<div className="flex flex-col">
			<Navbar />
			<Welcome />
			<View />
		</div>
	)
}

export default Home
