import {
    useSearchParams,
    useNavigate,
} from "react-router-dom";
import { useState } from "react";

function DatosCliente() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const servicioId = searchParams.get("servicioId");
    const fecha = searchParams.get("fecha");
    const hora = searchParams.get("hora");

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");

    const continuar = () => {
        if (!nombre || !apellido || !telefono || !email) {
            alert("Completá todos los campos.");
            return;
        }

        navigate(
            `/finalizar-turno?servicioId=${servicioId}&fecha=${fecha}&hora=${hora}&nombre=${encodeURIComponent(nombre)}&apellido=${encodeURIComponent(apellido)}&telefono=${encodeURIComponent(telefono)}&email=${encodeURIComponent(email)}`
        );
    };

    return (
        <main className="confirmar-turno">
            <div className="tarjeta-turno">

                <div className="icono-turno">
                    👤
                </div>

                <h1>Tus datos</h1>

                <p className="subtitulo-turno">
                    Completá tus datos para continuar
                </p>

                <div className="campo-servicio">
                    <label htmlFor="nombre">
                        Nombre
                    </label>

                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                        placeholder="Ingresá tu nombre"
                    />
                </div>

                <div className="campo-servicio">
                    <label htmlFor="apellido">
                        Apellido
                    </label>

                    <input
                        type="text"
                        id="apellido"
                        value={apellido}
                        onChange={(e) =>
                            setApellido(e.target.value)
                        }
                        placeholder="Ingresá tu apellido"
                    />
                </div>

                <div className="campo-servicio">
                    <label htmlFor="telefono">
                        Teléfono
                    </label>

                    <input
                        type="tel"
                        id="telefono"
                        value={telefono}
                        onChange={(e) =>
                            setTelefono(e.target.value)
                        }
                        placeholder="Ingresá tu teléfono"
                    />
                </div>

                <div className="campo-servicio">
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Ingresá tu email"
                    />
                </div>

                <button
                    type="button"
                    className="boton-confirmar"
                    onClick={continuar}
                >
                    Continuar
                </button>

            </div>
        </main>
    );
}

export default DatosCliente;