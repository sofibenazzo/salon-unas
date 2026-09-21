import {
    useSearchParams,
    useNavigate,
} from "react-router-dom";
import { useState } from "react";

function FinalizarTurno() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const servicioId = searchParams.get("servicioId");
    const fecha = searchParams.get("fecha");
    const hora = searchParams.get("hora");

    const nombre = searchParams.get("nombre");
    const apellido = searchParams.get("apellido");
    const telefono = searchParams.get("telefono");
    const email = searchParams.get("email");

    const [confirmando, setConfirmando] = useState(false);
    const [error, setError] = useState("");
    const [confirmado, setConfirmado] = useState(false);

    const confirmarTurno = async () => {
        try {
            setConfirmando(true);
            setError("");

            if (
                !servicioId ||
                !fecha ||
                !hora ||
                !nombre ||
                !apellido ||
                !telefono ||
                !email
            ) {
                setError(
                    "Faltan datos para poder confirmar el turno."
                );
                return;
            }

            // 1. Obtener o crear la clienta
            const respuestaCliente = await fetch(
                "http://localhost:3000/api/usuarios/cliente-reserva",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nombre,
                        apellido,
                        telefono,
                        email,
                    }),
                }
            );

            const datosCliente =
                await respuestaCliente.json();

            if (!respuestaCliente.ok) {
                throw new Error(
                    datosCliente.error ||
                    "No se pudo registrar la clienta."
                );
            }

            const usuarioId = datosCliente.usuario.id;

            // 2. Crear el turno
            const fechaHora = `${fecha}T${hora}:00`;

            const respuestaTurno = await fetch(
                "http://localhost:3000/api/turnos",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fechaHora,
                        usuarioId,
                        servicioId: Number(servicioId),
                    }),
                }
            );

            const datosTurno =
                await respuestaTurno.json();

            if (!respuestaTurno.ok) {
                throw new Error(
                    datosTurno.error ||
                    "No se pudo confirmar el turno."
                );
            }

            // 3. Turno creado correctamente
            setConfirmado(true);

        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "No se pudo confirmar el turno."
                );
            }
        } finally {
            setConfirmando(false);
        }
    };

    if (confirmado) {
        return (
            <main className="confirmar-turno">
                <div className="tarjeta-turno">

                    <div className="icono-turno">
                        💅
                    </div>

                    <h1>¡Turno confirmado!</h1>

                    <p className="subtitulo-turno">
                        Tu turno fue reservado correctamente.
                    </p>

                    <div className="resumen-turno">
                        <p>
                            <strong>Fecha:</strong>{" "}
                            {fecha}
                        </p>

                        <p>
                            <strong>Horario:</strong>{" "}
                            {hora}
                        </p>

                        <p>
                            <strong>Nombre:</strong>{" "}
                            {nombre} {apellido}
                        </p>

                        <p>
                            <strong>Teléfono:</strong>{" "}
                            {telefono}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="boton-confirmar"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Volver al inicio
                    </button>

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

                <h1>Revisá tu turno</h1>

                <p className="subtitulo-turno">
                    Verificá que los datos sean correctos
                </p>

                <div className="resumen-turno">

                    <p>
                        <strong>Servicio:</strong>{" "}
                        {servicioId}
                    </p>

                    <p>
                        <strong>Fecha:</strong>{" "}
                        {fecha}
                    </p>

                    <p>
                        <strong>Horario:</strong>{" "}
                        {hora}
                    </p>

                    <p>
                        <strong>Nombre:</strong>{" "}
                        {nombre} {apellido}
                    </p>

                    <p>
                        <strong>Teléfono:</strong>{" "}
                        {telefono}
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        {email}
                    </p>

                </div>

                {error && (
                    <p>
                        {error}
                    </p>
                )}

                <button
                    type="button"
                    className="boton-confirmar"
                    onClick={confirmarTurno}
                    disabled={confirmando}
                >
                    {confirmando
                        ? "Confirmando..."
                        : "Confirmar turno"}
                </button>

            </div>
        </main>
    );
}

export default FinalizarTurno;