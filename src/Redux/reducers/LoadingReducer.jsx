const LoadingReducer = (prevState = { isLoading: false }, action) => {
    switch (action.type) {
        case 'chang_loading':
            let newState = {...prevState}
            newState.isLoading = action.payload
            return newState

        default:
            return prevState
    }
}
export default LoadingReducer