import Modal, { ModalProps } from "./Modal";

const JoinLobbyModal = (props: ModalProps) => {
  return (
    <Modal {...props}>
      <div className="p-5  bg-dark m-5  rounded-lg">
        <p className="text-white text-3xl uppercase">Join Lobby</p>
        <hr />
        <div className="w-full flex items-center my-2 gap-3">
          <div className="flex flex-col gap-px w-1/2">
            <p className="text-white">Id</p>
            <input type="text" className="p-2 border-2 border-white rounded-lg" />
          </div>
          <div className="flex flex-col gap-px w-1/2">
            <p className="text-white">Pass Code</p>
            <input type="text" className="p-2 border-2 border-white rounded-lg" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default JoinLobbyModal;
