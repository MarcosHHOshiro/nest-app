import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    constructor() {
        const url = process.env.DATABASE_URL;
        if (!url) throw new Error('DATABASE_URL não carregada (verifique o .env)');

        const parsedUrl = new URL(url);
        const schema = parsedUrl.searchParams.get('schema') ?? undefined;

        if (schema) {
            parsedUrl.searchParams.delete('schema');
        }

        const adapter = new PrismaPg({ connectionString: parsedUrl.toString() }, schema ? { schema } : undefined);
        super({ adapter });
    }

    onModuleInit() {
        return this.$connect();
    }

    onModuleDestroy() {
        return this.$disconnect();
    }
}