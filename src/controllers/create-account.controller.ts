import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import bcrypt from 'bcryptjs'
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { z } from 'zod'

const createAccountSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email address'),
    password: z.string()
})

type CreateAccountBody = z.infer<typeof createAccountSchema>

@Controller('/accounts')
export class CreateAccountController {
    constructor(private prisma: PrismaService) { }

    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createAccountSchema))
    async handle(@Body() body: CreateAccountBody) {
        const { name, email, password } = body;

        const userWithSameEmail = await this.prisma.user.findUnique({ where: { email } })
        if (userWithSameEmail) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
        return user;
    }
}