import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const iniciarSesion = async () => {
        try {
            setCargando(true);
            setError("");

            const respuesta = await fetch(
                "http://localhost:3000/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.error ||
                    "No se pudo iniciar sesión"
                );
            }

            // Verificar que sea administradora
            if (datos.usuario.rol !== "ADMIN") {
                setError(
                    "Esta cuenta no tiene permisos de administradora."
                );
                return;
            }

            // Guardar sesión
            localStorage.setItem(
                "adminToken",
                datos.token
            );

            localStorage.setItem(
                "adminUsuario",
                JSON.stringify(datos.usuario)
            );

            // Ir al panel
            navigate("/admin/panel");

        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "No se pudo iniciar sesión"
                );
            }
        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="confirmar-turno">
            <div className="tarjeta-turno">

                <div className="icono-turno">
                    🔐
                </div>

                <h1>Panel administrativo</h1>

                <p className="subtitulo-turno">
                    Ingresá con tu cuenta de administradora
                </p>

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

                <div className="campo-servicio">
                    <label htmlFor="password">
                        Contraseña
                    </label>

                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Ingresá tu contraseña"
                    />
                </div>

                {error && (
                    <p>
                        {error}
                    </p>
                )}

                <button
                    type="button"
                    className="boton-confirmar"
                    onClick={iniciarSesion}
                    disabled={cargando}
                >
                    {cargando
                        ? "Ingresando..."
                        : "Ingresar"}
                </button>

            </div>
        </main>
    );
}

export default AdminLogin;