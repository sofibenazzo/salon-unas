import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";


interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string | null;
    activo: boolean;
    creadoEn: string;

    _count: {
        turnos: number;
    };
}


function GestionarClientes() {

    const navigate = useNavigate();


    const [clientes, setClientes] =
        useState<Cliente[]>([]);

    const [busqueda, setBusqueda] =
        useState("");

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");


    const obtenerClientes = async () => {

        try {

            setCargando(true);

            setError("");


            const token =
                localStorage.getItem(
                    "adminToken"
                );


            const respuesta =
                await fetch(
                    "http://localhost:3000/api/usuarios/clientes",
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
                    "No se pudieron obtener los clientes."
                );

            }


            setClientes(datos);


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
                    "No se pudieron obtener los clientes."
                );

            }


        } finally {

            setCargando(false);

        }

    };


    useEffect(() => {

        obtenerClientes();

    }, []);


    const cambiarEstado =
        async (
            cliente: Cliente
        ) => {

            const accion =
                cliente.activo
                    ? "desactivar"
                    : "activar";


            const confirmar =
                window.confirm(
                    `¿Querés ${accion} a ${cliente.nombre} ${cliente.apellido}?`
                );


            if (!confirmar) {
                return;
            }


            try {

                const token =
                    localStorage.getItem(
                        "adminToken"
                    );


                const respuesta =
                    await fetch(
                        `http://localhost:3000/api/usuarios/clientes/${cliente.id}/estado`,
                        {
                            method: "PATCH",

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
                        "No se pudo cambiar el estado del cliente."
                    );

                }


                setClientes(
                    clientesActuales =>
                        clientesActuales.map(
                            clienteActual =>
                                clienteActual.id ===
                                    cliente.id
                                    ? datos
                                    : clienteActual
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
                        "No se pudo cambiar el estado del cliente."
                    );

                }

            }

        };


    const formatearFecha =
        (
            fecha: string
        ) => {

            return new Date(
                fecha
            ).toLocaleDateString(
                "es-AR",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }
            );

        };


    const clientesFiltrados =
        clientes.filter(
            cliente => {

                const texto =
                    busqueda
                        .toLowerCase()
                        .trim();


                if (!texto) {
                    return true;
                }


                const nombreCompleto =
                    `${cliente.nombre} ${cliente.apellido}`
                        .toLowerCase();


                const email =
                    cliente.email
                        .toLowerCase();


                const telefono =
                    cliente.telefono
                        ?.toLowerCase() ||
                    "";


                return (
                    nombreCompleto.includes(
                        texto
                    ) ||
                    email.includes(
                        texto
                    ) ||
                    telefono.includes(
                        texto
                    )
                );

            }
        );


    if (cargando) {

        return (

            <main className="confirmar-turno">

                <div className="tarjeta-turno">

                    <h1>
                        Cargando clientes...
                    </h1>

                </div>

            </main>

        );

    }


    return (

        <main className="confirmar-turno">

            <div className="tarjeta-turno">


                <div className="icono-turno">
                    👤
                </div>


                <h1>
                    Gestionar clientes
                </h1>


                <p className="subtitulo-turno">
                    Consultá los clientes
                    registrados en el salón.
                </p>


                <div
                    style={{
                        marginBottom:
                            "20px",
                    }}
                >

                    <input
                        type="text"
                        placeholder="🔎 Buscar cliente..."
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(
                                e.target.value
                            )
                        }
                        style={{
                            width:
                                "100%",
                            padding:
                                "12px",
                            borderRadius:
                                "8px",
                            border:
                                "1px solid #ccc",
                            boxSizing:
                                "border-box",
                        }}
                    />

                </div>


                {error && (

                    <p>
                        {error}
                    </p>

                )}


                {!error &&
                    clientesFiltrados.length === 0 && (

                        <p>

                            {clientes.length === 0
                                ? "No hay clientes registrados."
                                : "No se encontraron clientes con esa búsqueda."
                            }

                        </p>

                    )}


                {!error &&
                    clientesFiltrados.length > 0 && (

                        <div>

                            {clientesFiltrados.map(
                                cliente => (

                                    <div
                                        key={
                                            cliente.id
                                        }
                                        style={{
                                            marginBottom:
                                                "20px",
                                        }}
                                    >

                                        <hr />


                                        <p>

                                            <strong>
                                                Cliente:
                                            </strong>{" "}

                                            {
                                                cliente.nombre
                                            }{" "}

                                            {
                                                cliente.apellido
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Email:
                                            </strong>{" "}

                                            {
                                                cliente.email
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Teléfono:
                                            </strong>{" "}

                                            {
                                                cliente.telefono ||
                                                "No informado"
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Turnos:
                                            </strong>{" "}

                                            {
                                                cliente
                                                    ._count
                                                    .turnos
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Registrado:
                                            </strong>{" "}

                                            {
                                                formatearFecha(
                                                    cliente.creadoEn
                                                )
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Estado:
                                            </strong>{" "}

                                            {
                                                cliente.activo
                                                    ? "🟢 Activo"
                                                    : "🔴 Inactivo"
                                            }

                                        </p>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                cambiarEstado(
                                                    cliente
                                                )
                                            }
                                        >

                                            {cliente.activo
                                                ? "🔴 Desactivar cliente"
                                                : "🟢 Activar cliente"
                                            }

                                        </button>

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


export default GestionarClientes;
