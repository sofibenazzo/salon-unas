import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";


interface Horario {
    id: number;
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
    activo: boolean;
}


const diasSemana = [
    {
        numero: 1,
        nombre: "Lunes",
    },
    {
        numero: 2,
        nombre: "Martes",
    },
    {
        numero: 3,
        nombre: "Miércoles",
    },
    {
        numero: 4,
        nombre: "Jueves",
    },
    {
        numero: 5,
        nombre: "Viernes",
    },
    {
        numero: 6,
        nombre: "Sábado",
    },
    {
        numero: 7,
        nombre: "Domingo",
    },
];


function GestionarHorarios() {

    const navigate = useNavigate();


    const [horarios, setHorarios] =
        useState<Horario[]>([]);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");

    const [editandoId, setEditandoId] =
        useState<number | null>(null);

    const [diaSemana, setDiaSemana] =
        useState("1");

    const [horaInicio, setHoraInicio] =
        useState("");

    const [horaFin, setHoraFin] =
        useState("");

    const [filtroDia, setFiltroDia] =
        useState("TODOS");


    const obtenerHorarios = async () => {

        try {

            setCargando(true);
            setError("");


            const token =
                localStorage.getItem(
                    "adminToken"
                );


            const respuesta =
                await fetch(
                    "http://localhost:3000/api/horarios",
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
                    "No se pudieron obtener los horarios."
                );

            }


            setHorarios(datos);


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
                    "No se pudieron obtener los horarios."
                );

            }

        } finally {

            setCargando(false);

        }

    };


    useEffect(() => {

        obtenerHorarios();

    }, []);


    const limpiarFormulario = () => {

        setEditandoId(null);
        setDiaSemana("1");
        setHoraInicio("");
        setHoraFin("");

    };


    const guardarHorario =
        async (
            e: React.FormEvent
        ) => {

            e.preventDefault();


            if (
                !horaInicio ||
                !horaFin
            ) {

                alert(
                    "La hora de inicio y finalización son obligatorias."
                );

                return;

            }


            if (
                horaInicio >= horaFin
            ) {

                alert(
                    "La hora de inicio debe ser menor que la hora de finalización."
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
                        ? `http://localhost:3000/api/horarios/${editandoId}`
                        : "http://localhost:3000/api/horarios";


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
                                    diaSemana:
                                        Number(
                                            diaSemana
                                        ),

                                    horaInicio:
                                        horaInicio,

                                    horaFin:
                                        horaFin,
                                }),
                        }
                    );


                const datos =
                    await respuesta.json();


                if (!respuesta.ok) {

                    throw new Error(
                        datos.error ||
                        "No se pudo guardar el horario."
                    );

                }


                limpiarFormulario();

                await obtenerHorarios();


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
                        "No se pudo guardar el horario."
                    );

                }

            }

        };


    const editarHorario =
        (
            horario: Horario
        ) => {

            setEditandoId(
                horario.id
            );

            setDiaSemana(
                String(
                    horario.diaSemana
                )
            );

            setHoraInicio(
                horario.horaInicio
            );

            setHoraFin(
                horario.horaFin
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

        };


    const eliminarHorario =
        async (
            horario: Horario
        ) => {

            const dia =
                diasSemana.find(
                    d =>
                        d.numero ===
                        horario.diaSemana
                );


            const confirmar =
                window.confirm(
                    `¿Querés eliminar el horario de ${dia?.nombre || "este día"} (${horario.horaInicio} - ${horario.horaFin})?`
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
                        `http://localhost:3000/api/horarios/${horario.id}`,
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
                        "No se pudo eliminar el horario."
                    );

                }


                await obtenerHorarios();


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
                        "No se pudo eliminar el horario."
                    );

                }

            }

        };


    const horariosFiltrados =
        horarios.filter(
            horario =>
                filtroDia ===
                "TODOS" ||
                horario.diaSemana ===
                Number(filtroDia)
        );


    if (cargando) {

        return (

            <main className="confirmar-turno">

                <div className="tarjeta-turno">

                    <h1>
                        Cargando horarios...
                    </h1>

                </div>

            </main>

        );

    }


    return (

        <main className="confirmar-turno">

            <div className="tarjeta-turno">


                <div className="icono-turno">
                    🕐
                </div>


                <h1>
                    Gestionar horarios
                </h1>


                <p className="subtitulo-turno">
                    Administrá los horarios
                    de atención del salón.
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
                        guardarHorario
                    }
                >

                    <h2>
                        {editandoId
                            ? "✏️ Editar horario"
                            : "➕ Nuevo horario"
                        }
                    </h2>


                    <select
                        value={diaSemana}
                        onChange={(e) =>
                            setDiaSemana(
                                e.target.value
                            )
                        }
                    >

                        {diasSemana.map(
                            dia => (

                                <option
                                    key={
                                        dia.numero
                                    }
                                    value={
                                        dia.numero
                                    }
                                >
                                    {dia.nombre}
                                </option>

                            )
                        )}

                    </select>


                    <input
                        type="time"
                        value={horaInicio}
                        onChange={(e) =>
                            setHoraInicio(
                                e.target.value
                            )
                        }
                    />


                    <input
                        type="time"
                        value={horaFin}
                        onChange={(e) =>
                            setHoraFin(
                                e.target.value
                            )
                        }
                    />


                    <button
                        type="submit"
                    >
                        {editandoId
                            ? "💾 Guardar cambios"
                            : "➕ Crear horario"
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


                <select
                    value={filtroDia}
                    onChange={(e) =>
                        setFiltroDia(
                            e.target.value
                        )
                    }
                >

                    <option value="TODOS">
                        Todos los días
                    </option>

                    {diasSemana.map(
                        dia => (

                            <option
                                key={
                                    dia.numero
                                }
                                value={
                                    dia.numero
                                }
                            >
                                {dia.nombre}
                            </option>

                        )
                    )}

                </select>


                {!error &&
                    horariosFiltrados.length ===
                    0 && (

                        <p>
                            No hay horarios registrados.
                        </p>

                    )}


                {!error &&
                    horariosFiltrados.length >
                    0 && (

                        <div>

                            {horariosFiltrados.map(
                                horario => {

                                    const dia =
                                        diasSemana.find(
                                            d =>
                                                d.numero ===
                                                horario.diaSemana
                                        );


                                    return (

                                        <div
                                            key={
                                                horario.id
                                            }
                                        >

                                            <hr />


                                            <p>
                                                <strong>
                                                    📅 Día:
                                                </strong>{" "}
                                                {
                                                    dia?.nombre
                                                }
                                            </p>


                                            <p>
                                                <strong>
                                                    🕐 Horario:
                                                </strong>{" "}
                                                {
                                                    horario.horaInicio
                                                }{" "}
                                                -
                                                {" "}
                                                {
                                                    horario.horaFin
                                                }
                                            </p>


                                            <p>
                                                <strong>
                                                    Estado:
                                                </strong>{" "}
                                                {
                                                    horario.activo
                                                        ? "🟢 Activo"
                                                        : "🔴 Inactivo"
                                                }
                                            </p>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editarHorario(
                                                        horario
                                                    )
                                                }
                                            >
                                                ✏️ Editar
                                            </button>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    eliminarHorario(
                                                        horario
                                                    )
                                                }
                                            >
                                                🗑️ Eliminar
                                            </button>

                                        </div>

                                    );

                                }
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


export default GestionarHorarios;
