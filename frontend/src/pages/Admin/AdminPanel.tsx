import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Turno {
    id: number;
    fechaHora: string;
    estado: string;
    usuario?: {
        nombre: string;
        apellido: string;
    };
    servicio?: {
        nombre: string;
        precio: number | string;
        duracion: number;
    };
}

interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string | null;
    activo: boolean;
}

interface Servicio {
    id: number;
    nombre: string;
    activo: boolean;
}

interface Horario {
    id: number;
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
    activo: boolean;
}

function AdminPanel() {
    const navigate = useNavigate();

    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [cargando, setCargando] = useState(true);

    const usuarioGuardado =
        localStorage.getItem("adminUsuario");

    const usuario = usuarioGuardado
        ? JSON.parse(usuarioGuardado)
        : null;

    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);

                const [
                    respuestaTurnos,
                    respuestaClientes,
                    respuestaServicios,
                    respuestaHorarios,
                ] = await Promise.all([
                    fetch("http://localhost:3000/api/turnos", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),

                    fetch("http://localhost:3000/api/usuarios/clientes", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),

                    fetch("http://localhost:3000/api/servicios"),

                    fetch("http://localhost:3000/api/horarios"),
                ]);

                if (respuestaTurnos.ok) {
                    const datos = await respuestaTurnos.json();

                    setTurnos(
                        Array.isArray(datos)
                            ? datos
                            : datos.turnos || []
                    );
                }

                if (respuestaClientes.ok) {
                    const datos = await respuestaClientes.json();

                    setClientes(
                        Array.isArray(datos)
                            ? datos
                            : datos.clientes || []
                    );
                }

                if (respuestaServicios.ok) {
                    const datos = await respuestaServicios.json();

                    setServicios(
                        Array.isArray(datos)
                            ? datos
                            : datos.servicios || []
                    );
                }

                if (respuestaHorarios.ok) {
                    const datos = await respuestaHorarios.json();

                    setHorarios(
                        Array.isArray(datos)
                            ? datos
                            : datos.horarios || []
                    );
                }
            } catch (error) {
                console.error(
                    "Error al cargar el dashboard:",
                    error
                );
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, [token]);

    const cerrarSesion = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsuario");

        navigate("/admin");
    };

    const hoy = new Date();

    const turnosDeHoy = turnos.filter((turno) => {
        const fecha = new Date(turno.fechaHora);

        return (
            fecha.getFullYear() === hoy.getFullYear() &&
            fecha.getMonth() === hoy.getMonth() &&
            fecha.getDate() === hoy.getDate() &&
            turno.estado !== "CANCELADO"
        );
    });

    const turnosPendientes = turnos.filter(
        (turno) =>
            turno.estado === "PENDIENTE"
    );

    const clientesActivos = clientes.filter(
        (cliente) => cliente.activo
    );

    const serviciosActivos = servicios.filter(
        (servicio) => servicio.activo
    );

    const horariosActivos = horarios.filter(
        (horario) => horario.activo
    );

    const proximosTurnos = turnos
        .filter((turno) => {
            const fecha = new Date(turno.fechaHora);

            return (
                fecha >= hoy &&
                turno.estado !== "CANCELADO"
            );
        })
        .sort(
            (a, b) =>
                new Date(a.fechaHora).getTime() -
                new Date(b.fechaHora).getTime()
        )
        .slice(0, 4);

    const formatearFecha = (
        fechaHora: string
    ) => {
        const fecha = new Date(fechaHora);

        return fecha.toLocaleDateString(
            "es-AR",
            {
                weekday: "short",
                day: "2-digit",
                month: "short",
            }
        );
    };

    const formatearHora = (
        fechaHora: string
    ) => {
        const fecha = new Date(fechaHora);

        return fecha.toLocaleTimeString(
            "es-AR",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    return (
        <main className="dashboard-nuevo">

            <div className="dashboard-wrapper">

                {/* =========================
                    ENCABEZADO
                ========================== */}

                <header className="dashboard-top">

                    <div className="dashboard-bienvenida">

                        <span className="dashboard-mini-logo">
                            ✦
                        </span>

                        <div>

                            <p className="dashboard-overline">
                                GISEL BORTOLOTTI NAILS
                            </p>

                            <h1>
                                Hola,{" "}
                                {usuario?.nombre ||
                                    "Administradora"} 💗
                            </h1>

                            <p>
                                Todo listo para gestionar
                                tu salón.
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        className="dashboard-logout"
                        onClick={cerrarSesion}
                    >
                        Cerrar sesión
                    </button>

                </header>


                {/* =========================
                    RESUMEN
                ========================== */}

                <section className="dashboard-stats">

                    <div className="dashboard-stat principal">

                        <div className="dashboard-stat-icon">
                            ♡
                        </div>

                        <div>
                            <span>
                                Turnos de hoy
                            </span>

                            <strong>
                                {cargando
                                    ? "..."
                                    : turnosDeHoy.length}
                            </strong>
                        </div>

                    </div>


                    <div className="dashboard-stat">

                        <div className="dashboard-stat-icon">
                            ◷
                        </div>

                        <div>
                            <span>
                                Pendientes
                            </span>

                            <strong>
                                {cargando
                                    ? "..."
                                    : turnosPendientes.length}
                            </strong>
                        </div>

                    </div>


                    <div className="dashboard-stat">

                        <div className="dashboard-stat-icon">
                            ♧
                        </div>

                        <div>
                            <span>
                                Clientes
                            </span>

                            <strong>
                                {cargando
                                    ? "..."
                                    : clientesActivos.length}
                            </strong>
                        </div>

                    </div>


                    <div className="dashboard-stat">

                        <div className="dashboard-stat-icon">
                            ✧
                        </div>

                        <div>
                            <span>
                                Servicios
                            </span>

                            <strong>
                                {cargando
                                    ? "..."
                                    : serviciosActivos.length}
                            </strong>
                        </div>

                    </div>

                </section>


                {/* =========================
                    CONTENIDO PRINCIPAL
                ========================== */}

                <section className="dashboard-main-grid">

                    {/* GESTIÓN */}

                    <div className="dashboard-box dashboard-gestion">

                        <div className="dashboard-box-heading">

                            <div>

                                <span>
                                    ADMINISTRACIÓN
                                </span>

                                <h2>
                                    Gestioná tu salón
                                </h2>

                                <p>
                                    Todo lo que necesitás,
                                    en un solo lugar.
                                </p>

                            </div>

                            <div className="dashboard-heading-icon">
                                💅
                            </div>

                        </div>


                        <div className="dashboard-menu">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/admin/turnos")
                                }
                                className="dashboard-menu-item"
                            >

                                <div className="dashboard-menu-icon">
                                    📅
                                </div>

                                <div>
                                    <strong>
                                        Turnos
                                    </strong>

                                    <small>
                                        Consultá y administrá
                                        las reservas.
                                    </small>
                                </div>

                                <span className="dashboard-arrow">
                                    →
                                </span>

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/admin/servicios")
                                }
                                className="dashboard-menu-item"
                            >

                                <div className="dashboard-menu-icon">
                                    💅
                                </div>

                                <div>
                                    <strong>
                                        Servicios
                                    </strong>

                                    <small>
                                        Precios, duración y
                                        servicios disponibles.
                                    </small>
                                </div>

                                <span className="dashboard-arrow">
                                    →
                                </span>

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/admin/horarios")
                                }
                                className="dashboard-menu-item"
                            >

                                <div className="dashboard-menu-icon">
                                    🕐
                                </div>

                                <div>
                                    <strong>
                                        Horarios
                                    </strong>

                                    <small>
                                        Organizá los horarios
                                        de atención.
                                    </small>
                                </div>

                                <span className="dashboard-arrow">
                                    →
                                </span>

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/admin/clientes")
                                }
                                className="dashboard-menu-item"
                            >

                                <div className="dashboard-menu-icon">
                                    👩🏻
                                </div>

                                <div>
                                    <strong>
                                        Clientes
                                    </strong>

                                    <small>
                                        Consultá tu lista de
                                        clientas.
                                    </small>
                                </div>

                                <span className="dashboard-arrow">
                                    →
                                </span>

                            </button>

                        </div>

                    </div>


                    {/* PRÓXIMOS TURNOS */}

                    <div className="dashboard-box dashboard-proximos">

                        <div className="dashboard-box-heading">

                            <div>

                                <span>
                                    AGENDA
                                </span>

                                <h2>
                                    Próximos turnos
                                </h2>

                                <p>
                                    Tus próximas reservas.
                                </p>

                            </div>

                            <div className="dashboard-heading-icon">
                                ♡
                            </div>

                        </div>


                        {cargando ? (

                            <div className="dashboard-empty">
                                <span>◷</span>
                                <p>
                                    Cargando turnos...
                                </p>
                            </div>

                        ) : proximosTurnos.length === 0 ? (

                            <div className="dashboard-empty">
                                <span>♡</span>

                                <strong>
                                    No hay próximos turnos
                                </strong>

                                <p>
                                    Cuando tengas reservas,
                                    aparecerán acá.
                                </p>
                            </div>

                        ) : (

                            <div className="dashboard-appointments">

                                {proximosTurnos.map(
                                    (turno) => (

                                        <div
                                            key={turno.id}
                                            className="dashboard-appointment"
                                        >

                                            <div className="appointment-date">

                                                <strong>
                                                    {formatearFecha(
                                                        turno.fechaHora
                                                    )}
                                                </strong>

                                                <span>
                                                    {formatearHora(
                                                        turno.fechaHora
                                                    )}
                                                </span>

                                            </div>


                                            <div className="appointment-info">

                                                <strong>
                                                    {turno.usuario
                                                        ? `${turno.usuario.nombre} ${turno.usuario.apellido}`
                                                        : "Cliente"}
                                                </strong>

                                                <span>
                                                    {turno.servicio?.nombre ||
                                                        "Servicio"}
                                                </span>

                                            </div>


                                            <div
                                                className={`appointment-status status-${turno.estado.toLowerCase()}`}
                                            >
                                                {turno.estado}
                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}


                        <button
                            type="button"
                            className="dashboard-ver-todos"
                            onClick={() =>
                                navigate("/admin/turnos")
                            }
                        >
                            Ver todos los turnos →
                        </button>

                    </div>

                </section>


                {/* =========================
                    INFORMACIÓN
                ========================== */}

                <section className="dashboard-info">

                    <div>

                        <span>
                            🕐
                        </span>

                        <div>
                            <small>
                                Horarios activos
                            </small>

                            <strong>
                                {cargando
                                    ? "..."
                                    : horariosActivos.length}
                            </strong>
                        </div>

                    </div>


                    <div>

                        <span>
                            💅
                        </span>

                        <div>
                            <small>
                                Servicios activos
                            </small>

                            <strong>
                                {cargando
                                    ? "..."
                                    : serviciosActivos.length}
                            </strong>
                        </div>

                    </div>


                    <div>

                        <span>
                            👩🏻
                        </span>

                        <div>
                            <small>
                                Clientas activas
                            </small>

                            <strong>
                                {cargando
                                    ? "..."
                                    : clientesActivos.length}
                            </strong>
                        </div>

                    </div>

                </section>


                <footer className="dashboard-footer-nuevo">
                    Gisel Bortolotti Nails · Panel administrativo
                    <span>✦</span>
                </footer>

            </div>

        </main>
    );
}

export default AdminPanel;
