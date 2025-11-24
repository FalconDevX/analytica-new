import Header from './Header'
import View from './View'
import Welcome from './Welcome'
import Footer from './Footer'

const Home = () => {
    return (
        <div className="flex flex-col">
            <Header />
            <Welcome />
            <View />
        </div>
    )
}

export default Home