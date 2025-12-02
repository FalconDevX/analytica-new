import View from './View'
import Welcome from './Welcome'
import Navbar from './Navbar'

const Home = () => {
    return (
        <div id ="home" className="flex flex-col">
            <Navbar />
            <Welcome />
            <View />
        </div>
    )
}

export default Home