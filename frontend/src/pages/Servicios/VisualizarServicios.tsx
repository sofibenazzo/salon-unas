import { useEffect, useState } from "react";

interface Servicio {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    duracion: number;
    activo: boolean;
}

function VisualizarServicios() {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const obtenerServicios = async () => {
            try {
                const respuesta = await fetch(
                    "http://localhost:3000/api/servicios"
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudieron obtener los servicios");
                }

                const datos = await respuesta.json();

                setServicios(datos);
            } catch (error) {
                console.error(error);
                setError("No se pudieron cargar los servicios.");
            } finally {
                setCargando(false);
            }
        };

        obtenerServicios();
    }, []);

    const servicio = servicios.find(
        (item) => item.id.toString() === servicioSeleccionado
    );

    return (
        <main className="visualizar-servicios">
            <div className="tarjeta-servicios">

                <div className="icono-turno">
                    ✨
                </div>

                <h1>Visualizar servicios</h1>

                <p className="subtitulo-turno">
                    Conocé nuestros servicios y precios
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
                            value={servicioSeleccionado}
                            onChange={(e) =>
                                setServicioSeleccionado(e.target.value)
                            }
                        >
                            <option value="">
                                Seleccioná un servicio
                            </option>

                            {servicios.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {servicio && (
                    <div className="precio-servicio">
                        <span>💅</span>

                        <strong>
                            {servicio.nombre}
                        </strong>

                        {servicio.descripcion && (
                            <p>{servicio.descripcion}</p>
                        )}

                        <p>
                            ${servicio.precio.toLocaleString("es-AR")}
                        </p>

                        <small>
                            Duración: {servicio.duracion} minutos
                        </small>
                    </div>
                )}

            </div>
        </main>
    );
}

export default VisualizarServicios;