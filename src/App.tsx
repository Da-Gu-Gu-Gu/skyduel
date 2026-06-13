import Home from "./pages/Home";
import Battle from "./pages/Battle";
import Lobby from "./pages/Lobby/Lobby";
import GlobalProvider from "./Provider/GlobalProvider";

const App = () => {
  return (
    <GlobalProvider>
      {/* <Home /> */}
      <Lobby />
      {/* <Battle /> */}
    </GlobalProvider>
  );
};

export default App;
