import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing'
import { hash } from "bcryptjs";
import request from 'supertest';

describe('Create account (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('[POST] /sessions', async () => {
        await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john@example.com',
                password: await hash('password123', 8)
            }
        });

        const response = await request(app.getHttpServer())
            .post('/sessions')
            .send({
                email: 'john@example.com',
                password: 'password123',
            })

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('access_token');
    });
});