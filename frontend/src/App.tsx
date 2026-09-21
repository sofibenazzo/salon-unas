import "./App.css";

import {
  useState,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import GestionarTurno from "./pages/Turnos/GestionarTurno";
import ElegirHorario from "./pages/Turnos/ElegirHorario";
import VisualizarServicios from "./pages/Servicios/VisualizarServicios";
import Ubicacion from "./pages/Ubicacion/Ubicacion";
import ConfirmarTurno from "./pages/Turnos/ConfirmarTurno";
import DatosCliente from "./pages/Turnos/DatosCliente";
import FinalizarTurno from "./pages/Turnos/FinalizarTurno";

import AdminLogin from "./pages/Admin/AdminLogin";
import AdminPanel from "./pages/Admin/AdminPanel";
import GestionarTurnos from "./pages/Admin/GestionarTurnos";
import GestionarServicios from "./pages/Admin/GestionarServicios";
import GestionarHorarios from "./pages/Admin/GestionarHorarios";
import GestionarClientes from "./pages/Admin/GestionarClientes";


function Inicio() {

  const [tipoUsuario, setTipoUsuario] =
    useState<"inicio" | "clienta">(
      "inicio"
    );


  /* ------------------------------
     PANTALLA INICIAL
  ------------------------------ */

  if (tipoUsuario === "inicio") {

    return (

      <main className="inicio">

        <div className="contenido-inicio">

          <header className="encabezado">

            <h1>
              Gisel Bortolotti Nails
            </h1>

            <p>
              Bienvenidas 💅
            </p>

          </header>


          <div className="bienvenida-rol">

            <h2>
              ¿Cómo querés ingresar?
            </h2>

            <p>
              Elegí una opción para continuar
            </p>

          </div>


          <section className="opciones">

            {/* CLIENTA */}

            <button
              type="button"
              className="opcion"
              onClick={() =>
                setTipoUsuario("clienta")
              }
            >

              <span>
                💅
              </span>

              <strong>
                Soy clienta
              </strong>

              <small>
                Sacá tu turno y conocé
                nuestros servicios
              </small>

            </button>


            {/* ADMINISTRADORA */}

            <Link
              to="/admin"
              className="opcion"
            >

              <span>
                🔐
              </span>

              <strong>
                Soy administradora
              </strong>

              <small>
                Ingresá al panel de administración
              </small>

            </Link>

          </section>

        </div>

      </main>

    );

  }


  /* ------------------------------
     OPCIONES DE CLIENTA
  ------------------------------ */

  return (

    <main className="inicio">

      <div className="contenido-inicio">

        <header className="encabezado">

          <h1>
            Gisel Bortolotti Nails
          </h1>

          <p>
            Todo para tus uñas 💅
          </p>

        </header>


        <div className="bienvenida-rol">

          <h2>
            ¡Hola! 💗
          </h2>

          <p>
            ¿Qué querés hacer?
          </p>

        </div>


        <section className="opciones">

          {/* SACAR TURNO */}

          <Link
            to="/gestionar-turno"
            className="opcion"
          >

            <span>
              💅
            </span>

            <strong>
              Gestionar turno
            </strong>

            <small>
              Reservá tu turno online
            </small>

          </Link>


          {/* SERVICIOS */}

          <Link
            to="/visualizar-servicios"
            className="opcion"
          >

            <span>
              ✨
            </span>

            <strong>
              Ver servicios
            </strong>

            <small>
              Conocé nuestros servicios
            </small>

          </Link>


          {/* UBICACIÓN */}

          <Link
            to="/ubicacion"
            className="opcion"
          >

            <span>
              📍
            </span>

            <strong>
              ¿Dónde nos encontramos?
            </strong>

            <small>
              Ubicación y horarios
            </small>

          </Link>


          {/* CANCELAR */}

          <a
            className="opcion"
            href="https://wa.me/5493564470961?text=Hola%20Gisel%2C%20quiero%20cancelar%20mi%20turno."
            target="_blank"
            rel="noopener noreferrer"
          >

            <span>
              ❌
            </span>

            <strong>
              Cancelar turno
            </strong>

            <small>
              Cancelá un turno existente
            </small>

          </a>

        </section>


        {/* VOLVER */}

        <button
          type="button"
          className="boton-volver-inicio"
          onClick={() =>
            setTipoUsuario("inicio")
          }
        >
          ← Volver
        </button>

      </div>

    </main>

  );

}


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* INICIO */}

        <Route
          path="/"
          element={
            <Inicio />
          }
        />


        {/* ------------------------------
            FLUJO CLIENTA
        ------------------------------ */}

        <Route
          path="/gestionar-turno"
          element={
            <GestionarTurno />
          }
        />

        <Route
          path="/seleccionar-horario"
          element={
            <ElegirHorario />
          }
        />

        <Route
          path="/visualizar-servicios"
          element={
            <VisualizarServicios />
          }
        />

        <Route
          path="/ubicacion"
          element={
            <Ubicacion />
          }
        />

        <Route
          path="/confirmar-turno"
          element={
            <ConfirmarTurno />
          }
        />

        <Route
          path="/datos-cliente"
          element={
            <DatosCliente />
          }
        />

        <Route
          path="/finalizar-turno"
          element={
            <FinalizarTurno />
          }
        />


        {/* ------------------------------
            ADMINISTRACIÓN
        ------------------------------ */}

        <Route
          path="/admin"
          element={
            <AdminLogin />
          }
        />

        <Route
          path="/admin/panel"
          element={
            <AdminPanel />
          }
        />

        <Route
          path="/admin/turnos"
          element={
            <GestionarTurnos />
          }
        />

        <Route
          path="/admin/servicios"
          element={
            <GestionarServicios />
          }
        />

        <Route
          path="/admin/horarios"
          element={
            <GestionarHorarios />
          }
        />

        <Route
          path="/admin/clientes"
          element={
            <GestionarClientes />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;
