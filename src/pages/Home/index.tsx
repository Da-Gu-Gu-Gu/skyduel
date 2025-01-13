import Background from "../../components/Background"
import HomeScene from "./HomeScene"

const Home = () => {
    return (
        <div className="w-full h-full relative">
            <Background />
            <div className="z-10 absolute top-0">
                <HomeScene />
            </div>
        </div>
    )
}

export default Home