import { CSSProperties, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Button from "../Buttons/Button";
import { colors } from "../../utils/theme/color";

export type ModalSize = "sm" | "md" | "lg" | "xl";

// Popup width per size. md is the default and is comfortably larger than
// the old content-hugging width.
const SIZE_WIDTH: Record<ModalSize, string> = {
  sm: "w-[340px]",
  md: "w-[440px]",
  lg: "w-[560px]",
  xl: "w-[680px]",
};

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
  size?: ModalSize;
  /** Disables only the submit button (Cancel stays clickable). */
  submitDisable?: boolean;
}
const Modal = ({
  children,
  isCenter = false,
  setClose,
  loading,
  disable,
  top,
  left,
  onSubmit,
  label = "Save",
  size = "md",
  submitDisable = false,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(modalRef.current, { scale: 0.7, opacity: 1, duration: 0.35, ease: "back.out(1.7)" });
  }, []);

  return (
    <div
      ref={modalRef}
      style={{ position: "fixed", top: top, left: left }}
      className={`z-20 p-2 rounded-lg bg-pink ${SIZE_WIDTH[size]} ${isCenter && "-translate-x-1/2 -translate-y-1/2"}`}
    >
      {children}
      <div className="flex gap-3 p-3 pt-0 items-center justify-end">
        <Button label={"Cancel"} loading={loading} disable={disable} onClick={() => setClose()} bgColor={colors.white} textColor={"gray"} />
        <Button label={label} loading={loading} disable={disable || submitDisable} onClick={onSubmit} bgColor={colors.purple} textColor={colors.white} />
      </div>
    </div>
  );
};

export default Modal;
