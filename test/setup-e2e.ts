import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { randomUUID } from "node:crypto";
import "dotenv/config";
import { execSync } from "node:child_process";

let prisma: PrismaClient;

function generateUniqueDatabaseUrl(schemaId: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined in the environment variables');
    }

    const url = new URL(process.env.DATABASE_URL);

    url.searchParams.set('schema', schemaId);

    return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
    const dataURl = generateUniqueDatabaseUrl(schemaId);

    process.env.DATABASE_URL = dataURl;

    execSync("pnpm prisma migrate deploy", { stdio: "inherit" });

    const adapter = new PrismaPg({ connectionString: dataURl });
    prisma = new PrismaClient({ adapter });
    await prisma.$connect();
});

afterAll(async () => {
    if (!prisma) {
        return;
    }

    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
    await prisma.$disconnect();
});