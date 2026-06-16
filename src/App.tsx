import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby/Lobby";
import Battle from "./pages/Battle";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import GlobalProvider from "./Provider/GlobalProvider";

const App = () => {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/battle" element={<Battle />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
};

export default App;
