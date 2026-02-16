import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing'
import request from 'supertest';

describe('Create account (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);
        jwt = moduleRef.get(JwtService);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('[POST] /questions', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            }
        });

        const acessToken = jwt.sign({ sub: user.id });

        const response = await request(app.getHttpServer())
            .post('/questions')
            .set('Authorization', `Bearer ${acessToken}`)
            .send({
                title: 'New question',
                content: 'This is a new question',
            })

        expect(response.status).toBe(201);

        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'New question',
            }
        });

        expect(questionOnDatabase).toBeTruthy();
    });
});