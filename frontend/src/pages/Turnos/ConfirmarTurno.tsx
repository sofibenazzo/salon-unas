import {
    useSearchParams,
    useNavigate,
} from "react-router-dom";

function ConfirmarTurno() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const servicioId = searchParams.get("servicioId");
    const fecha = searchParams.get("fecha");
    const hora = searchParams.get("hora");

    return (
        <main className="confirmar-turno">
            <div className="tarjeta-turno">

                <div className="icono-turno">
                    💅
                </div>

                <h1>Confirmar tu turno</h1>

                <p className="subtitulo-turno">
                    Revisá los datos de tu turno
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

                </div>

                <button
                    type="button"
                    className="boton-confirmar"
                    onClick={() => {
                        navigate(
                            `/datos-cliente?servicioId=${servicioId}&fecha=${fecha}&hora=${hora}`
                        );
                    }}
                >
                    Continuar
                </button>

            </div>
        </main>
    );
}

export default ConfirmarTurno;