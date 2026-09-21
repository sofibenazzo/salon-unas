import { useEffect, useState } from "react";
import {
    useSearchParams,
    useNavigate,
} from "react-router-dom";

interface Disponibilidad {
    fecha: string;
    servicioId: number;
    servicio: {
        id: number;
        nombre: string;
        duracion: number;
    };
    horarioAtencion: {
        inicio: string;
        fin: string;
    };
    horariosDisponibles: string[];
}

function ElegirHorario() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const servicioId = Number(
        searchParams.get("servicioId")
    );

    const [fecha, setFecha] = useState("");
    const [horarios, setHorarios] = useState<string[]>([]);
    const [servicio, setServicio] =
        useState<Disponibilidad["servicio"] | null>(null);

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!servicioId || !fecha) {
            setHorarios([]);
            return;
        }

        const obtenerDisponibilidad = async () => {
            try {
                setCargando(true);
                setError("");

                const respuesta = await fetch(
                    `http://localhost:3000/api/disponibilidad?servicioId=${servicioId}&fecha=${fecha}`
                );

                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        datos.error ||
                        "No se pudo obtener la disponibilidad"
                    );
                }

                setHorarios(
                    datos.horariosDisponibles
                );

                setServicio(datos.servicio);
            } catch (error) {
                console.error(error);

                setError(
                    "No se pudo obtener la disponibilidad."
                );

                setHorarios([]);
            } finally {
                setCargando(false);
            }
        };

        obtenerDisponibilidad();
    }, [servicioId, fecha]);

    if (!servicioId) {
        return (
            <main className="seleccionar-horario">
                <div className="tarjeta-horario">

                    <div className="icono-turno">
                        📅
                    </div>

                    <h1>
                        Seleccionar día y horario
                    </h1>

                    <p className="subtitulo-turno">
                        Primero tenés que seleccionar
                        un servicio.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/gestionar-turno")
                        }
                    >
                        Volver a servicios
                    </button>

                </div>
            </main>
        );
    }

    return (
        <main className="seleccionar-horario">
            <div className="tarjeta-horario">

                <div className="icono-turno">
                    📅
                </div>

                <h1>
                    Seleccionar día y horario
                </h1>

                <p className="subtitulo-turno">
                    Elegí cuándo querés disfrutar
                    tu turno
                </p>

                {servicio && (
                    <p>
                        Servicio:{" "}
                        <strong>
                            {servicio.nombre}
                        </strong>
                    </p>
                )}

                <div className="campo-horario">

                    <label htmlFor="dia">
                        Elegí un día
                    </label>

                    <input
                        type="date"
                        id="dia"
                        value={fecha}
                        min={
                            new Date()
                                .toISOString()
                                .split("T")[0]
                        }
                        onChange={(e) => {
                            setFecha(
                                e.target.value
                            );

                            setHorarios([]);
                        }}
                    />

                </div>

                {fecha && cargando && (
                    <p>
                        Cargando horarios...
                    </p>
                )}

                {error && (
                    <p>{error}</p>
                )}

                {fecha &&
                    !cargando &&
                    !error && (
                        <div className="campo-horario">

                            <label htmlFor="horario">
                                Elegí un horario
                            </label>

                            {horarios.length === 0 ? (
                                <p>
                                    No hay horarios
                                    disponibles para
                                    este día.
                                </p>
                            ) : (
                                <select
                                    id="horario"
                                    defaultValue=""
                                    onChange={(e) => {
                                        const hora =
                                            e.target.value;

                                        if (!hora) {
                                            return;
                                        }

                                        navigate(
                                            `/confirmar-turno?servicioId=${servicioId}&fecha=${fecha}&hora=${hora}`
                                        );
                                    }}
                                >
                                    <option value="">
                                        Seleccioná un
                                        horario
                                    </option>

                                    {horarios.map(
                                        (hora) => (
                                            <option
                                                key={hora}
                                                value={hora}
                                            >
                                                {hora}
                                            </option>
                                        )
                                    )}
                                </select>
                            )}

                        </div>
                    )}

            </div>
        </main>
    );
}

export default ElegirHorario;
