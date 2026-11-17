import { Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx";

import Inicio from "./pages/Inicio.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Carrito from "./pages/Carrito.jsx";
import Checkout from "./pages/Checkout.jsx";
import CompraExitosa from "./pages/CompraExitosa.jsx";
import CompraFallida from "./pages/CompraFallida.jsx";
import Registro from "./pages/Registro.jsx";
import Login from "./pages/Login.jsx";
import MisPedidos from "./pages/MisPedidos.jsx";
import PanelVendedor from "./pages/PanelVendedor.jsx";
import PanelAdmin from "./pages/PanelAdmin.jsx";
import SinAcceso from "./pages/SinAcceso.jsx";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sin-acceso" element={<SinAcceso />} />

        <Route
          path="/carrito"
          element={
            <RutaProtegida roles={["CLIENTE"]}>
              <Carrito />
            </RutaProtegida>
          }
        />

        <Route
          path="/checkout"
          element={
            <RutaProtegida roles={["CLIENTE"]}>
              <Checkout />
            </RutaProtegida>
          }
        />

        <Route
          path="/compra-exitosa"
          element={
            <RutaProtegida roles={["CLIENTE"]}>
              <CompraExitosa />
            </RutaProtegida>
          }
        />

        <Route
          path="/compra-fallida"
          element={
            <RutaProtegida roles={["CLIENTE"]}>
              <CompraFallida />
            </RutaProtegida>
          }
        />

        <Route
          path="/mis-pedidos"
          element={
            <RutaProtegida roles={["CLIENTE"]}>
              <MisPedidos />
            </RutaProtegida>
          }
        />

        <Route
          path="/vendedor"
          element={
            <RutaProtegida roles={["VENDEDOR", "ADMIN"]}>
              <PanelVendedor seccion="productos" />
            </RutaProtegida>
          }
        />

        <Route
          path="/vendedor/ordenes"
          element={
            <RutaProtegida roles={["VENDEDOR", "ADMIN"]}>
              <PanelVendedor seccion="ordenes" />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin"
          element={
            <RutaProtegida roles={["ADMIN"]}>
              <PanelAdmin />
            </RutaProtegida>
          }
        />

        <Route
          path="*"
          element={
            <main className="container huerto-main">
              <h2>Página no encontrada</h2>
              <p>Usa el menú para volver a una página del sitio.</p>
            </main>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}
