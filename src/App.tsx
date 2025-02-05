
// import Home from "./pages/Home"
import Lobby from "./pages/Lobby/Lobby"
import GlobalProvider from "./Provider/GlobalProvider"


const App = () => {
  return (
    <GlobalProvider>
      {/* <Home /> */}
      <Lobby />
    </GlobalProvider>
  )
}

export default App