import { CSSProperties } from "react"
import LoadingSpinner from "../Loading/LoadingSpinner"


interface ButtonProps {
    label: string,
    loading?: boolean,
    disable?: boolean,
    onClick?: () => void,
    icon?: JSX.Element,
    bgColor: CSSProperties['backgroundColor'],
    textColor: CSSProperties['backgroundColor']
}
export const disableStyle = '!cursor-not-allowed !bg-gray-300 !text-gray-400'
const Button = ({ label, loading = false, disable = false, onClick, icon = undefined, bgColor, textColor }: ButtonProps) => {

    return (
        <button onClick={onClick} disabled={loading || disable} style={{ backgroundColor: textColor }} className={` rounded-md  cursor-pointer  w-max pr-1 pb-1 h-[50px] transition-transform duration-300 ease-bounce enabled:hover:scale-[1.08]`}>
            <div style={{
                backgroundColor: bgColor,
                color: textColor

            }} className={`${(loading || disable) && disableStyle}  w-full uppercase  p-3 pt-4  bg-[${bgColor}] rounded-md h-full flex items-center gap-2 justify-center text-2xl cursor-pointer tracking-wide text-[${textColor}]`}>
                {loading ? <LoadingSpinner spinColor={textColor} /> : icon}{label}
            </div>
        </button>

    )
}

export default Button