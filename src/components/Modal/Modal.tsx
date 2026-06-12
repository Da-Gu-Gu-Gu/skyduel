import { CSSProperties, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Button from "../Buttons/Button";
import { colors } from "../../utils/theme/color";

export interface ModalProps {
  children?: React.ReactNode;
  setClose: () => void;
  loading?: boolean;
  disable?: boolean;
  top: CSSProperties["top"];
  left: CSSProperties["left"];
  onSubmit?: () => void;
  label?: string;
  isCenter?: boolean;
}
const Modal = ({ children, isCenter = false, setClose, loading, disable, top, left, onSubmit, label = "Save" }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(modalRef.current, { scale: 0.7, opacity: 1, duration: 0.35, ease: "back.out(1.7)" });
  }, []);

  return (
    <div
      ref={modalRef}
      style={{ position: "fixed", top: top, left: left }}
      className={`z-20 p-2 rounded-lg bg-pink ${isCenter && "-translate-x-1/2 -translate-y-1/2"}`}
    >
      {children}
      <div className="flex gap-3 items-center justify-end">
        <Button label={"Cancel"} loading={loading} disable={disable} onClick={() => setClose()} bgColor={colors.white} textColor={"gray"} />
        <Button label={label} loading={loading} disable={disable} onClick={onSubmit} bgColor={colors.purple} textColor={colors.white} />
      </div>
    </div>
  );
};

export default Modal;
