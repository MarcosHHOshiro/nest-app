import { ConflictException } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import bcrypt from 'bcryptjs'
import { PrismaService } from "src/prisma/prisma.service";

@Controller('/accounts')
export class CreateAccountController {
    constructor(private prisma: PrismaService) { }

    @Post()
    @HttpCode(201)
    async handle(@Body() body: any) {
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