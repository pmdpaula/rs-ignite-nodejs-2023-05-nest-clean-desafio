import { Module } from "@nestjs/common";

import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { CourierModule } from "./controllers/courier/courier.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { TestController } from "./controllers/test.controller";
import { StorageModule } from "./storage/storage.module";

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    StorageModule,
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [CreateAccountController, TestController, AuthenticateController],
  providers: [RegisterCourierUseCase, AuthenticateCourierUseCase],
    CourierModule,
  ],
  // providers: [ReceiverModule, CourierModule],
})
export class HttpModule {}
