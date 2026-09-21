import { useEffect, useState, } from "react";

import { useNavigate } from "react-router-dom";

interface Turno {
    id: number;
    fechaHora: string;
    estado: string;
    observacion?: string | null;

    usuario: {
        id: number;
        nombre: string;
        apellido: string;
        email: string;
        telefono?: string | null;
    };

    servicio: {
        id: number;
        nombre: string;
        precio: number | string;
        duracion: number;
    };
}


function GestionarTurnos() {

    const navigate = useNavigate();


    const [turnos, setTurnos] =
        useState<Turno[]>([]);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");

    const [busqueda, setBusqueda] =
        useState("");

    const [fechaFiltro, setFechaFiltro] =
        useState("");

    const [estadoFiltro, setEstadoFiltro] =
        useState("TODOS");


    const obtenerTurnos = async () => {

        try {

            setCargando(true);

            setError("");


            const token =
                localStorage.getItem(
                    "adminToken"
                );


            const respuesta =
                await fetch(
                    "http://localhost:3000/api/turnos",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            const datos =
                await respuesta.json();


            if (!respuesta.ok) {

                throw new Error(
                    datos.error ||
                    "No se pudieron obtener los turnos."
                );

            }


            setTurnos(datos);


        } catch (error) {

            console.error(error);


            if (
                error instanceof Error
            ) {

                setError(
                    error.message
                );

            } else {

                setError(
                    "No se pudieron obtener los turnos."
                );

            }

        } finally {

            setCargando(false);

        }

    };


    useEffect(() => {

        obtenerTurnos();

    }, []);


    const formatearFecha =
        (
            fechaHora: string
        ) => {

            return new Date(
                fechaHora
            ).toLocaleDateString(
                "es-AR",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }
            );

        };


    const formatearHora =
        (
            fechaHora: string
        ) => {

            return new Date(
                fechaHora
            ).toLocaleTimeString(
                "es-AR",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );

        };


    const obtenerFechaParaFiltro =
        (
            fechaHora: string
        ) => {

            const fecha =
                new Date(
                    fechaHora
                );


            const año =
                fecha.getFullYear();

            const mes =
                String(
                    fecha.getMonth() + 1
                ).padStart(2, "0");

            const dia =
                String(
                    fecha.getDate()
                ).padStart(2, "0");


            return `${año}-${mes}-${dia}`;

        };


    const cambiarEstado =
        async (
            turno: Turno,
            nuevoEstado: string
        ) => {

            if (
                nuevoEstado ===
                turno.estado
            ) {
                return;
            }


            try {

                const token =
                    localStorage.getItem(
                        "adminToken"
                    );


                const respuesta =
                    await fetch(
                        `http://localhost:3000/api/turnos/${turno.id}/estado`,
                        {
                            method: "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,
                            },

                            body: JSON.stringify({
                                estado:
                                    nuevoEstado,
                            }),
                        }
                    );


                const datos =
                    await respuesta.json();


                if (!respuesta.ok) {

                    throw new Error(
                        datos.error ||
                        "No se pudo cambiar el estado del turno."
                    );

                }


                setTurnos(
                    turnosActuales =>
                        turnosActuales.map(
                            turnoActual =>
                                turnoActual.id ===
                                    turno.id
                                    ? {
                                        ...turnoActual,
                                        estado:
                                            datos.estado,
                                    }
                                    : turnoActual
                        )
                );


            } catch (error) {

                console.error(error);


                if (
                    error instanceof Error
                ) {

                    alert(
                        error.message
                    );

                } else {

                    alert(
                        "No se pudo cambiar el estado del turno."
                    );

                }

            }

        };


    const cancelarTurno =
        async (
            turno: Turno
        ) => {

            const confirmar =
                window.confirm(
                    `¿Querés cancelar el turno de ${turno.usuario.nombre} ${turno.usuario.apellido}?`
                );


            if (!confirmar) {
                return;
            }


            await cambiarEstado(
                turno,
                "CANCELADO"
            );

        };


    const turnosFiltrados =
        turnos.filter(
            turno => {

                const texto =
                    busqueda
                        .toLowerCase()
                        .trim();


                const nombreCliente =
                    `${turno.usuario.nombre} ${turno.usuario.apellido}`
                        .toLowerCase();


                const emailCliente =
                    turno.usuario.email
                        .toLowerCase();


                const nombreServicio =
                    turno.servicio.nombre
                        .toLowerCase();


                const coincideBusqueda =
                    !texto ||
                    nombreCliente.includes(
                        texto
                    ) ||
                    emailCliente.includes(
                        texto
                    ) ||
                    nombreServicio.includes(
                        texto
                    );


                const coincideFecha =
                    !fechaFiltro ||
                    obtenerFechaParaFiltro(
                        turno.fechaHora
                    ) === fechaFiltro;


                const coincideEstado =
                    estadoFiltro ===
                    "TODOS" ||
                    turno.estado ===
                    estadoFiltro;


                return (
                    coincideBusqueda &&
                    coincideFecha &&
                    coincideEstado
                );

            }
        );


    if (cargando) {

        return (

            <main className="confirmar-turno">

                <div className="tarjeta-turno">

                    <h1>
                        Cargando turnos...
                    </h1>

                </div>

            </main>

        );

    }


    return (

        <main className="confirmar-turno">

            <div className="tarjeta-turno">


                <div className="icono-turno">
                    📅
                </div>


                <h1>
                    Gestionar turnos
                </h1>


                <p className="subtitulo-turno">
                    Consultá y administrá
                    los turnos del salón.
                </p>


                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        marginBottom: "20px",
                    }}
                >

                    <input
                        type="text"
                        placeholder="🔎 Buscar cliente o servicio..."
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(
                                e.target.value
                            )
                        }
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                        }}
                    />


                    <input
                        type="date"
                        value={fechaFiltro}
                        onChange={(e) =>
                            setFechaFiltro(
                                e.target.value
                            )
                        }
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                        }}
                    />


                    <select
                        value={estadoFiltro}
                        onChange={(e) =>
                            setEstadoFiltro(
                                e.target.value
                            )
                        }
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                        }}
                    >

                        <option value="TODOS">
                            Todos los estados
                        </option>

                        <option value="PENDIENTE">
                            Pendientes
                        </option>

                        <option value="CONFIRMADO">
                            Confirmados
                        </option>

                        <option value="COMPLETADO">
                            Completados
                        </option>

                        <option value="CANCELADO">
                            Cancelados
                        </option>

                    </select>


                    {(busqueda ||
                        fechaFiltro ||
                        estadoFiltro !==
                        "TODOS") && (

                            <button
                                type="button"
                                onClick={() => {
                                    setBusqueda("");
                                    setFechaFiltro("");
                                    setEstadoFiltro(
                                        "TODOS"
                                    );
                                }}
                            >
                                🧹 Limpiar filtros
                            </button>

                        )}

                </div>


                {error && (

                    <p>
                        {error}
                    </p>

                )}


                {!error &&
                    turnosFiltrados.length === 0 && (

                        <p>

                            {turnos.length === 0
                                ? "No hay turnos registrados."
                                : "No se encontraron turnos con los filtros seleccionados."
                            }

                        </p>

                    )}


                {!error &&
                    turnosFiltrados.length > 0 && (

                        <div>

                            {turnosFiltrados.map(
                                turno => (

                                    <div
                                        key={
                                            turno.id
                                        }
                                        style={{
                                            marginBottom:
                                                "25px",
                                        }}
                                    >

                                        <hr />


                                        <p>

                                            <strong>
                                                👤 Cliente:
                                            </strong>{" "}

                                            {
                                                turno
                                                    .usuario
                                                    .nombre
                                            }{" "}

                                            {
                                                turno
                                                    .usuario
                                                    .apellido
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                📧 Email:
                                            </strong>{" "}

                                            {
                                                turno
                                                    .usuario
                                                    .email
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                📞 Teléfono:
                                            </strong>{" "}

                                            {
                                                turno
                                                    .usuario
                                                    .telefono ||
                                                "No informado"
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                💅 Servicio:
                                            </strong>{" "}

                                            {
                                                turno
                                                    .servicio
                                                    .nombre
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                💰 Precio:
                                            </strong>{" "}

                                            $
                                            {
                                                Number(
                                                    turno
                                                        .servicio
                                                        .precio
                                                ).toLocaleString(
                                                    "es-AR"
                                                )
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                ⏱️ Duración:
                                            </strong>{" "}

                                            {
                                                turno
                                                    .servicio
                                                    .duracion
                                            }{" "}
                                            minutos

                                        </p>


                                        <p>

                                            <strong>
                                                📅 Fecha:
                                            </strong>{" "}

                                            {
                                                formatearFecha(
                                                    turno.fechaHora
                                                )
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                🕐 Hora:
                                            </strong>{" "}

                                            {
                                                formatearHora(
                                                    turno.fechaHora
                                                )
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Estado:
                                            </strong>{" "}

                                            {
                                                turno.estado ===
                                                    "PENDIENTE"
                                                    ? "🟡 Pendiente"
                                                    : turno.estado ===
                                                        "CONFIRMADO"
                                                        ? "🔵 Confirmado"
                                                        : turno.estado ===
                                                            "COMPLETADO"
                                                            ? "🟢 Completado"
                                                            : "🔴 Cancelado"
                                            }

                                        </p>


                                        <select
                                            value={
                                                turno.estado
                                            }
                                            onChange={(e) =>
                                                cambiarEstado(
                                                    turno,
                                                    e.target
                                                        .value
                                                )
                                            }
                                            disabled={
                                                turno.estado ===
                                                "CANCELADO" ||
                                                turno.estado ===
                                                "COMPLETADO"
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                borderRadius: "8px",
                                                border: "1px solid #ccc",
                                                marginBottom: "10px",
                                            }}
                                        >

                                            <option value="PENDIENTE">
                                                🟡 Pendiente
                                            </option>

                                            <option value="CONFIRMADO">
                                                🔵 Confirmado
                                            </option>

                                            <option value="COMPLETADO">
                                                🟢 Completado
                                            </option>

                                            <option value="CANCELADO">
                                                🔴 Cancelado
                                            </option>

                                        </select>


                                        {turno.estado !==
                                            "CANCELADO" &&
                                            turno.estado !==
                                            "COMPLETADO" && (

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        cancelarTurno(
                                                            turno
                                                        )
                                                    }
                                                >
                                                    ❌ Cancelar turno
                                                </button>

                                            )}

                                    </div>

                                )
                            )}

                        </div>

                    )}


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/panel"
                        )
                    }
                >
                    ⬅️ Volver al panel
                </button>


            </div>

        </main>

    );

}


export default GestionarTurnos;
