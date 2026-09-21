import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";


interface Servicio {
    id: number;
    nombre: string;
    descripcion?: string | null;
    precio: number | string;
    duracion: number;
    activo: boolean;
}


function GestionarServicios() {

    const navigate = useNavigate();


    const [servicios, setServicios] =
        useState<Servicio[]>([]);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");

    const [busqueda, setBusqueda] =
        useState("");

    const [editandoId, setEditandoId] =
        useState<number | null>(null);

    const [nombre, setNombre] =
        useState("");

    const [descripcion, setDescripcion] =
        useState("");

    const [precio, setPrecio] =
        useState("");

    const [duracion, setDuracion] =
        useState("");


    const obtenerServicios = async () => {

        try {

            setCargando(true);
            setError("");

            const respuesta =
                await fetch(
                    "http://localhost:3000/api/servicios"
                );

            const datos =
                await respuesta.json();

            if (!respuesta.ok) {

                throw new Error(
                    datos.error ||
                    "No se pudieron obtener los servicios."
                );

            }

            setServicios(datos);

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
                    "No se pudieron obtener los servicios."
                );

            }

        } finally {

            setCargando(false);

        }

    };


    useEffect(() => {

        obtenerServicios();

    }, []);


    const limpiarFormulario = () => {

        setEditandoId(null);
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setDuracion("");

    };


    const guardarServicio =
        async (
            e: React.FormEvent
        ) => {

            e.preventDefault();


            if (
                !nombre.trim() ||
                !precio ||
                !duracion
            ) {

                alert(
                    "Nombre, precio y duración son obligatorios."
                );

                return;

            }


            const precioNumero =
                Number(precio);

            const duracionNumero =
                Number(duracion);


            if (
                Number.isNaN(
                    precioNumero
                ) ||
                precioNumero <= 0
            ) {

                alert(
                    "El precio debe ser mayor a 0."
                );

                return;

            }


            if (
                Number.isNaN(
                    duracionNumero
                ) ||
                duracionNumero <= 0
            ) {

                alert(
                    "La duración debe ser mayor a 0."
                );

                return;

            }


            try {

                const token =
                    localStorage.getItem(
                        "adminToken"
                    );


                const url =
                    editandoId
                        ? `http://localhost:3000/api/servicios/${editandoId}`
                        : "http://localhost:3000/api/servicios";


                const metodo =
                    editandoId
                        ? "PUT"
                        : "POST";


                const respuesta =
                    await fetch(
                        url,
                        {
                            method: metodo,

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,
                            },

                            body:
                                JSON.stringify({
                                    nombre:
                                        nombre.trim(),

                                    descripcion:
                                        descripcion.trim() ||
                                        null,

                                    precio:
                                        precioNumero,

                                    duracion:
                                        duracionNumero,
                                }),
                        }
                    );


                const datos =
                    await respuesta.json();


                if (!respuesta.ok) {

                    throw new Error(
                        datos.error ||
                        "No se pudo guardar el servicio."
                    );

                }


                limpiarFormulario();

                await obtenerServicios();


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
                        "No se pudo guardar el servicio."
                    );

                }

            }

        };


    const editarServicio =
        (
            servicio: Servicio
        ) => {

            setEditandoId(
                servicio.id
            );

            setNombre(
                servicio.nombre
            );

            setDescripcion(
                servicio.descripcion ||
                ""
            );

            setPrecio(
                String(
                    servicio.precio
                )
            );

            setDuracion(
                String(
                    servicio.duracion
                )
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

        };


    const eliminarServicio =
        async (
            servicio: Servicio
        ) => {

            const confirmar =
                window.confirm(
                    `¿Querés eliminar el servicio "${servicio.nombre}"?`
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
                        `http://localhost:3000/api/servicios/${servicio.id}`,
                        {
                            method: "DELETE",

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
                        "No se pudo eliminar el servicio."
                    );

                }


                await obtenerServicios();


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
                        "No se pudo eliminar el servicio."
                    );

                }

            }

        };


    const serviciosFiltrados =
        servicios.filter(
            servicio => {

                const texto =
                    busqueda
                        .toLowerCase()
                        .trim();


                if (!texto) {
                    return true;
                }


                return (
                    servicio.nombre
                        .toLowerCase()
                        .includes(texto) ||
                    (
                        servicio.descripcion ||
                        ""
                    )
                        .toLowerCase()
                        .includes(texto)
                );

            }
        );


    if (cargando) {

        return (

            <main className="confirmar-turno">

                <div className="tarjeta-turno">

                    <h1>
                        Cargando servicios...
                    </h1>

                </div>

            </main>

        );

    }


    return (

        <main className="confirmar-turno">

            <div className="tarjeta-turno">


                <div className="icono-turno">
                    💅
                </div>


                <h1>
                    Gestionar servicios
                </h1>


                <p className="subtitulo-turno">
                    Administrá los servicios
                    disponibles en el salón.
                </p>


                {error && (

                    <p
                        style={{
                            color: "red",
                            marginBottom: "15px",
                        }}
                    >
                        {error}
                    </p>

                )}


                <form
                    onSubmit={
                        guardarServicio
                    }
                >

                    <h2>
                        {editandoId
                            ? "✏️ Editar servicio"
                            : "➕ Nuevo servicio"
                        }
                    </h2>


                    <input
                        type="text"
                        placeholder="Nombre del servicio"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(
                                e.target.value
                            )
                        }
                    />


                    <textarea
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) =>
                            setDescripcion(
                                e.target.value
                            )
                        }
                    />


                    <input
                        type="number"
                        placeholder="Precio"
                        min="0"
                        step="0.01"
                        value={precio}
                        onChange={(e) =>
                            setPrecio(
                                e.target.value
                            )
                        }
                    />


                    <input
                        type="number"
                        placeholder="Duración en minutos"
                        min="1"
                        value={duracion}
                        onChange={(e) =>
                            setDuracion(
                                e.target.value
                            )
                        }
                    />


                    <button
                        type="submit"
                    >
                        {editandoId
                            ? "💾 Guardar cambios"
                            : "➕ Crear servicio"
                        }
                    </button>


                    {editandoId && (

                        <button
                            type="button"
                            onClick={
                                limpiarFormulario
                            }
                        >
                            ❌ Cancelar edición
                        </button>

                    )}

                </form>


                <hr />


                <input
                    type="text"
                    placeholder="🔎 Buscar servicio..."
                    value={busqueda}
                    onChange={(e) =>
                        setBusqueda(
                            e.target.value
                        )
                    }
                />


                {serviciosFiltrados.length ===
                    0 ? (

                    <p>
                        No se encontraron
                        servicios.
                    </p>

                ) : (

                    <div>

                        {serviciosFiltrados.map(
                            servicio => (

                                <div
                                    key={
                                        servicio.id
                                    }
                                >

                                    <hr />


                                    <p>
                                        <strong>
                                            💅 Servicio:
                                        </strong>{" "}
                                        {
                                            servicio.nombre
                                        }
                                    </p>


                                    <p>
                                        <strong>
                                            📝 Descripción:
                                        </strong>{" "}
                                        {
                                            servicio.descripcion ||
                                            "Sin descripción"
                                        }
                                    </p>


                                    <p>
                                        <strong>
                                            💰 Precio:
                                        </strong>{" "}
                                        $
                                        {
                                            Number(
                                                servicio.precio
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
                                            servicio.duracion
                                        }{" "}
                                        minutos
                                    </p>


                                    <p>
                                        <strong>
                                            Estado:
                                        </strong>{" "}
                                        {
                                            servicio.activo
                                                ? "🟢 Activo"
                                                : "🔴 Inactivo"
                                        }
                                    </p>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            editarServicio(
                                                servicio
                                            )
                                        }
                                    >
                                        ✏️ Editar
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            eliminarServicio(
                                                servicio
                                            )
                                        }
                                    >
                                        🗑️ Eliminar
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


export default GestionarServicios;
