import Lottie from "react-lottie";
import animationData from "../assets/data/Animation.json";

const LottieAnimation = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <div>
            <Lottie options={defaultOptions} height={700} width={700} />
        </div>
    );
};

export default LottieAnimation;
