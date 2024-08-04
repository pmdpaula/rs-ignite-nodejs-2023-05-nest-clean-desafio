import { Module } from "@nestjs/common";

import { AuthenticateCourierUseCase } from "@/domain/delivery/application/use-case/courier/authenticate-courier";
import { RegisterCourierUseCase } from "@/domain/delivery/application/use-case/courier/register-courier";

import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { TestController } from "./controllers/test.controller";
import { StorageModule } from "./storage/storage.module";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [CreateAccountController, TestController, AuthenticateController],
  providers: [RegisterCourierUseCase, AuthenticateCourierUseCase],
})
export class HttpModule {}
