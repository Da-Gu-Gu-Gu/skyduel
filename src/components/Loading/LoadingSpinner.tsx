

const LoadingSpinner = ({ spinColor = "#fff" }) => {
    return (
        <div className={`animate-spin rounded-full h-8 w-8 border-t-2  border-[${spinColor}]`}></div>

    )
}

export default LoadingSpinner