import Sparkle from "../Lottie/Sparkle";
interface BackgroundProps {
  isHome?: boolean;
}
const Background = ({ isHome = true }: BackgroundProps): JSX.Element => {
  return (
    <div
      style={
        {
          "--from-color": "#ffbe0b",
          "--to-color": "#f48c06",
        } as React.CSSProperties
      }
      className="h-full w-full flex items-center justify-center  bg-[linear-gradient(45deg,var(--from-color)60%,var(--to-color)100%)]"
    >
      {isHome && <Sparkle />}
    </div>
  );
};

export default Background;
