import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing'
import request from 'supertest';

describe('Fetch recent questions (e2e)', () => {
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

    test('[GET] /questions', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            }
        });

        const acessToken = jwt.sign({ sub: user.id });

        await prisma.question.createMany({
            data: [
                {
                    title: 'Question 1',
                    content: 'This is question 1',
                    authorId: user.id,
                    slug: 'question-1'
                },
                {
                    title: 'Question 2',
                    content: 'This is question 2',
                    authorId: user.id,
                    slug: 'question-2'
                }
            ]
        })

        const response = await request(app.getHttpServer())
            .get('/questions')
            .set('Authorization', `Bearer ${acessToken}`)
            .send()

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            questions: [
                expect.objectContaining({ title: 'Question 1' }),
                expect.objectContaining({ title: 'Question 2' }),
            ],
        });
    });
});