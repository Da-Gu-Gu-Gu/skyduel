import { useState } from "react";
import { ArrowRightOnRectangleIcon, MusicalNoteIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import Modal, { ModalProps } from "./Modal";

type ToggleRowProps = {
  label: string;
  icon: JSX.Element;
  value: boolean;
  onChange: (next: boolean) => void;
};

const ToggleRow = ({ label, icon, value, onChange }: ToggleRowProps) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-2 text-white">
      {icon}
      <span className="uppercase tracking-wide">{label}</span>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className={`h-7 w-12 rounded-full p-1 transition-colors duration-200 ${value ? "bg-purple" : "bg-gray-400"}`}
    >
      <div className={`h-5 w-5 rounded-full bg-white transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  </div>
);

const SettingsModal = (props: ModalProps) => {
  const [music, setMusic] = useState(true);
  const [sound, setSound] = useState(true);

  const handleLogout = () => {
    // No auth/session layer yet — close the panel for now. Wire real sign-out here later.
    props.setClose();
  };

  return (
    <Modal {...props} label="Save">
      <div className="m-3 rounded-lg bg-dark p-5">
        <h1 className="text-3xl uppercase tracking-wider text-white">Settings</h1>
        <hr className="my-2" />
        <ToggleRow label="Music" icon={<MusicalNoteIcon className="h-6 w-6" />} value={music} onChange={setMusic} />
        <ToggleRow label="Sound" icon={<SpeakerWaveIcon className="h-6 w-6" />} value={sound} onChange={setSound} />
        <hr className="my-2" />
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-danger py-3 uppercase tracking-wide text-white transition-transform duration-300 ease-bounce hover:scale-[1.03]"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          Logout
        </button>
      </div>
    </Modal>
  );
};

export default SettingsModal;
