import { CSSProperties } from "react";
import Button from "../Buttons/Button";
import { colors } from "../../utils/theme/color";

export interface ModalProps {
    children?: React.ReactNode;
    setClose: () => void;
    loading?: boolean,
    disable?: boolean,
    top: CSSProperties['top'],
    left: CSSProperties['left']
    onSubmit?: () => void
    label?: string
}
const Modal = ({ children, setClose, loading, disable, top, left, onSubmit, label = "Save" }: ModalProps) => {
    return (
        <div style={{
            position: "fixed",
            top: top,
            left: left
        }} className=" z-20 p-2 rounded-lg bg-pink" >
            {children}
            <div className="flex gap-3 items-center justify-end">
                <Button label={"Cancel"} loading={loading} disable={disable} onClick={() => setClose()} bgColor={colors.white} textColor={'gray'} />
                <Button label={label} loading={loading} disable={disable} onClick={onSubmit} bgColor={colors.purple} textColor={colors.white} />
            </div>
        </div>
    )
}

export default Modal