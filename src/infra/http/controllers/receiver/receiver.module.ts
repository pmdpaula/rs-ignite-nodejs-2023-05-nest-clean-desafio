import { Module } from "@nestjs/common";

import { AuthenticateCourierUseCase } from "@/domain/delivery/application/use-case/courier/authenticate-courier";
import { AuthenticateReceiverUseCase } from "@/domain/delivery/application/use-case/receiver/authenticate-receiver";
import { ChangePasswordReceiverUseCase } from "@/domain/delivery/application/use-case/receiver/change-password-receiver";
import { EditReceiverUseCase } from "@/domain/delivery/application/use-case/receiver/edit-receiver";
import { GetReceiverByPhoneUseCase } from "@/domain/delivery/application/use-case/receiver/get-receiver-by-phone";
import { RegisterReceiverUseCase } from "@/domain/delivery/application/use-case/receiver/register-receiver";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";

import { StorageModule } from "../../storage/storage.module";
import { AuthenticateReceiverController } from "./authenticate-receiver.controller";
import { ChangePasswordReceiverController } from "./change-password-receiver.controller";
import { EditReceiverController } from "./edit-receiver.controller";
import { GetReceiverByPhoneController } from "./get-receiver-by-phone.controller";
import { RegisterReceiverAccountController } from "./register-receiver-account.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    RegisterReceiverAccountController,
    AuthenticateReceiverController,
    GetReceiverByPhoneController,
    EditReceiverController,
    ChangePasswordReceiverController,
  ],
  providers: [
    RegisterReceiverUseCase,
    // RegisterCourierUseCase,
    AuthenticateCourierUseCase,
    AuthenticateReceiverUseCase,
    GetReceiverByPhoneUseCase,
    EditReceiverUseCase,
    ChangePasswordReceiverUseCase,
  ],
})
export class ReceiverModule {}
