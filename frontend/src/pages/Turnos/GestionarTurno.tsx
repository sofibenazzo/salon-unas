import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Servicio {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    duracion: number;
    activo: boolean;
}

function GestionarTurno() {
    const navigate = useNavigate();

    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const obtenerServicios = async () => {
            try {
                const respuesta = await fetch(
                    "http://localhost:3000/api/servicios"
                );

                if (!respuesta.ok) {
                    throw new Error();
                }

                const datos = await respuesta.json();

                setServicios(datos);
            } catch {
                setError("No se pudieron cargar los servicios.");
            } finally {
                setCargando(false);
            }
        };

        obtenerServicios();
    }, []);

    return (
        <main className="gestionar-turno">
            <div className="tarjeta-turno">

                <div className="icono-turno">
                    💅
                </div>

                <h1>Gestionar tu turno</h1>

                <p className="subtitulo-turno">
                    Elegí el servicio que querés realizar
                </p>

                {cargando && (
                    <p>Cargando servicios...</p>
                )}

                {error && (
                    <p>{error}</p>
                )}

                {!cargando && !error && (
                    <div className="campo-servicio">

                        <label htmlFor="servicio">
                            Seleccioná un servicio
                        </label>

                        <select
                            id="servicio"
                            name="servicio"
                            defaultValue=""
                            onChange={(e) => {
                                const servicioId = Number(
                                    e.target.value
                                );

                                if (servicioId) {
                                    navigate(
                                        `/seleccionar-horario?servicioId=${servicioId}`
                                    );
                                }
                            }}
                        >
                            <option value="">
                                Seleccioná un servicio
                            </option>

                            {servicios.map((servicio) => (
                                <option
                                    key={servicio.id}
                                    value={servicio.id}
                                >
                                    {servicio.nombre}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

            </div>
        </main>
    );
}

export default GestionarTurno;