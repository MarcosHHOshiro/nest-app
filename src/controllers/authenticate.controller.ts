import { Controller, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

// const createAccountSchema = z.object({
//     name: z.string().min(1, 'Name is required'),
//     email: z.email('Invalid email address'),
//     password: z.string()
// })

// type CreateAccountBody = z.infer<typeof createAccountSchema>

@Controller('/sessions')
export class AuthenticateController {
    constructor(private jwt: JwtService) { }

    @Post()
    // @HttpCode(201)
    // @UsePipes(new ZodValidationPipe(createAccountSchema))
    async handle() {
        const token = await this.jwt.sign({ sub: '123' });

        return token;
    }
}