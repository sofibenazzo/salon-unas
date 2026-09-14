import "dotenv/config";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "./dist/src/generated/client.js";

const adapter = new PrismaMssql(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

try {
    const resultado = await prisma.$queryRawUnsafe(
        "SELECT DB_NAME() AS BaseDeDatos"
    );

    console.log("Conexión exitosa:");
    console.log(resultado);
} catch (error) {
    console.error("Error de conexión:");
    console.error(error);
} finally {
    await prisma.$disconnect();
}