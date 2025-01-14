import { disableStyle } from './Button'
import LoadingSpinner from './LoadingSpinner'

interface IconButtonProps {
    icon: JSX.Element,
    loading?: boolean,
    disable?: boolean,
    onClick?: () => void

}

const IconButton = ({ icon, loading, disable, onClick }: IconButtonProps) => {
    return (
        <button disabled={loading || disable} onClick={onClick} className={`${disable && disableStyle} bg-dark font-bold py-1 px-2 rounded`}>
            {loading ? <LoadingSpinner /> : icon}
        </button>
    )
}

export default IconButton