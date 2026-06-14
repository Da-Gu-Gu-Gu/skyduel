import { useNavigate } from "react-router-dom"

const Header = () => {
    const navigate = useNavigate()
    return (
        <header className="absolute z-20 flex items-center justify-between w-full top-0 p-5">
            <h1
                onClick={() => navigate("/")}
                style={{ WebkitTextStroke: "0px white" }}
                className="text-6xl text-stroke font-bold text-dark cursor-pointer select-none"
            >
                <span className="text-[#ff006e]">Sky</span>Duel
            </h1>
            <h1 className="text-3xl text-pink bg-white py-2 pt-4 px-4 rounded-3xl flex items-center">Gu Gu Gr Gr</h1>
        </header>
    )
}

export default Header
