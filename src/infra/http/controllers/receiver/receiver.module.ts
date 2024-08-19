import { Module } from "@nestjs/common";

import { AuthenticateReceiverUseCase } from "@/domain/delivery/application/use-case/receiver/authenticate-receiver";
import { GetReceiverByPhoneUseCase } from "@/domain/delivery/application/use-case/receiver/get-receiver-by-phone";
import { RegisterReceiverUseCase } from "@/domain/delivery/application/use-case/receiver/register-receiver";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";

import { StorageModule } from "../../storage/storage.module";
import { AuthenticateReceiverController } from "./authenticate-receiver.controller";
import { GetReceiverByPhoneController } from "./get-receiver-by-phone.controller";
import { RegisterReceiverAccountController } from "./register-receiver-account.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    RegisterReceiverAccountController,
    AuthenticateReceiverController,
    GetReceiverByPhoneController,
  ],
  providers: [
    RegisterReceiverUseCase,
    AuthenticateReceiverUseCase,
    GetReceiverByPhoneUseCase,
  ],
})
export class ReceiverModule {}
