import { CSSProperties } from "react";
import Button from "../Button";
import { colors } from "../../utils/theme/color";

export interface ModalProps {
    isOpen: boolean;
    children?: React.ReactNode;
    setIsOpen: (isOpen: boolean) => void;
    loading?: boolean,
    disable?: boolean,
    top: CSSProperties['top'],
    left: CSSProperties['left']
    onSubmit?: () => void
    label?: string
}
const Modal = ({ children, isOpen, setIsOpen, loading, disable, top, left, onSubmit, label = "Save" }: ModalProps) => {
    return (
        <div style={{
            position: "fixed",
            top: top,
            left: left
        }} className=" z-20 p-2 rounded-lg bg-pink" >
            {children}
            <div className="flex gap-3 items-center justify-end">
                <Button label={"Cancel"} loading={loading} disable={disable} onClick={() => setIsOpen(!isOpen)} bgColor={colors.white} textColor={'gray'} />
                <Button label={label} loading={loading} disable={disable} onClick={onSubmit} bgColor={colors.purple} textColor={colors.white} />
            </div>
        </div>
    )
}

export default Modal