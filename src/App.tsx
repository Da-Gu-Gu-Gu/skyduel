
import Home from "./pages/Home"
import GlobalProvider from "./Provider/GlobalProvider"


const App = () => {
  return (
    <GlobalProvider>
      <Home />
    </GlobalProvider>
  )
}

export default App