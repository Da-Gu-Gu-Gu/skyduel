import { JSX } from "react/jsx-runtime";
import Modal, { ModalProps } from "./Modal";
import { customizeColors } from "../../utils/theme/color";
import useContainer from "../../pages/Home/useContainer";

const ColorPicker = (props: ModalProps): JSX.Element => {
  const { selectedPart, setSelectedPart, handleColorClick, bodyPartColor } = useContainer();

  return (
    <Modal {...props}>
      <div className="mb-3 p-4 text-white w-full">
        <h1 className="text-3xl uppercase tracking-wider">Customize</h1>
        <hr />
        <div className="grid grid-cols-4 pt-2 uppercase items-center justify-center">
          {["Body", "Face", "Eye", "Ear"].map((category) => (
            <button
              key={category}
              className={`text-center uppercase py-1 px-2 ${selectedPart === category ? " text-white" : " text-gray-400"}`}
              onClick={() => setSelectedPart(category as "Body" | "Face" | "Eye" | "Ear")}
            >
              {category}
            </button>
          ))}
        </div>
        <hr />
        <div className="grid grid-cols-5 w-full items-center gap-x-5 gap-y-2 py-2">
          {customizeColors.map((color, index) => (
            <div
              key={index}
              className={`cursor-pointer h-8 border-2 ${bodyPartColor[selectedPart] === color ? "border-white" : "border-dark"}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color, selectedPart)}
            ></div>
          ))}
        </div>
        <hr />
      </div>
    </Modal>
  );
};

export default ColorPicker;
