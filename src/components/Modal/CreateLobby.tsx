import Modal, { ModalProps } from './Modal'

const CreateLobbyModal = (props: ModalProps) => {
    return (
        <Modal {...props}>
            <div className='mb-3 p-3 flex flex-col gap-2'>
                <h1 className='text-3xl uppercase tracking-wider text-white'>Create Lobby</h1>
                <hr />
                <div>
                    <p className='text-white'> Pass Code</p>
                    <input type="text" className="w-[300px] p-2 border-2 border-white rounded-lg" />
                </div>
            </div>
        </Modal>
    )
}

export default CreateLobbyModal