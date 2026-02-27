import { Module } from '@nestjs/common';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-question.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [
        CreateAccountController,
        AuthenticateController,
        CreateQuestionController,
        FetchRecentQuestionsController
    ],
    providers: []
})

export class HttpModule { }
