import { Module } from "@nestjs/common";

import { AuthenticateCourierUseCase } from "@/domain/delivery/application/use-case/courier/authenticate-courier";
import { ChangePasswordCourierUseCase } from "@/domain/delivery/application/use-case/courier/change-password-courier";
import { DeleteCourierUseCase } from "@/domain/delivery/application/use-case/courier/delete-courier";
import { EditCourierUseCase } from "@/domain/delivery/application/use-case/courier/edit-courier";
import { RegisterCourierUseCase } from "@/domain/delivery/application/use-case/courier/register-courier";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";

import { StorageModule } from "../../storage/storage.module";
import { AuthenticateCourierController } from "./authenticate-courier.controller";
import { ChangePasswordCourierController } from "./change-password-courier.controller";
import { DeleteCourierController } from "./delete-courier.controller";
import { EditCourierController } from "./edit-courier.controller";
import { RegisterCourierAccountController } from "./register-courier-account.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    RegisterCourierAccountController,
    AuthenticateCourierController,
    EditCourierController,
    ChangePasswordCourierController,
    DeleteCourierController,
  ],
  providers: [
    RegisterCourierUseCase,
    AuthenticateCourierUseCase,
    EditCourierUseCase,
    ChangePasswordCourierUseCase,
    DeleteCourierUseCase,
  ],
})
export class CourierModule {}
