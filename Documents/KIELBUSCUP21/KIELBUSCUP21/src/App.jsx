import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Register from "./pages/Register";
import Player from "./pages/Player";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import QRCodePage from "./pages/QRCodePage";

import ProtectedAdmin from "./components/ProtectedAdmin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Pantalla inicial pública con el QR del torneo */}
        <Route
          path="/"
          element={<QRCodePage />}
        />

        {/* Registro al que lleva el QR */}
        <Route
          path="/registro"
          element={<Register />}
        />

        {/* Ficha del jugador */}
        <Route
          path="/jugador"
          element={<Player />}
        />

        {/* Login administrador */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* Panel administrador */}
        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <Admin />
            </ProtectedAdmin>
          }
        />

        {/* Generador de QR */}
        <Route
          path="/qr-code"
          element={
            <ProtectedAdmin>
              <QRCodePage />
            </ProtectedAdmin>
          }
        />

        {/* Ruta desconocida */}
        <Route
          path="*"
          element={
            <Navigate
              to="/registro"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}