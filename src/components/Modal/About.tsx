import { UserGroupIcon, PaperAirplaneIcon, TrophyIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import Modal, { ModalProps } from "./Modal";

type FeatureRowProps = {
  icon: JSX.Element;
  children: React.ReactNode;
};

const FeatureRow = ({ icon, children }: FeatureRowProps) => (
  <div className="flex items-center gap-3 py-1.5 text-white">
    <span className="text-purple">{icon}</span>
    <span>{children}</span>
  </div>
);

const AboutModal = (props: ModalProps) => (
  <Modal {...props} label="Got it!">
    <div className="m-3 rounded-lg bg-dark p-5">
      <h1 className="text-3xl uppercase tracking-wider text-white">About HookDuel</h1>
      <hr className="my-2" />
      <p className="py-2 text-white">
        A small, fun 2-player dueling game. Invite a friend, customize your character, and duel to win!
      </p>
      <hr className="my-2" />
      <FeatureRow icon={<UserGroupIcon className="h-6 w-6" />}>Two players, head to head</FeatureRow>
      <FeatureRow icon={<PaperAirplaneIcon className="h-6 w-6" />}>Invite each other to a lobby</FeatureRow>
      <FeatureRow icon={<TrophyIcon className="h-6 w-6" />}>Duel it out to win</FeatureRow>
      <FeatureRow icon={<GlobeAltIcon className="h-6 w-6" />}>Playable on the web for now</FeatureRow>
      <hr className="my-2" />
      <p className="text-sm uppercase tracking-wide text-white opacity-60">v0.0.1 · more to come</p>
    </div>
  </Modal>
);

export default AboutModal;
