function Ubicacion() {
    const mapsUrl =
        "https://www.google.com/maps/search/?api=1&query=25%20de%20Mayo%201950%2C%20San%20Francisco%2C%20C%C3%B3rdoba%2C%20Argentina";

    return (
        <div className="ubicacion">
            <h1>¿Dónde nos encontramos?</h1>

            <span>📍</span>

            <h2>Paseo Colón</h2>

            <p>25 de Mayo 1950</p>
            <p>San Francisco, Córdoba</p>

            <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="boton-maps"
            >
                📍 Ver en Google Maps
            </a>
        </div>
    );
}

export default Ubicacion;