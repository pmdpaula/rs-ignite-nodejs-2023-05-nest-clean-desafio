import { Module } from "@nestjs/common";

import { AuthenticateCourierUseCase } from "@/domain/delivery/application/use-case/courier/authenticate-courier";
import { RegisterCourierUseCase } from "@/domain/delivery/application/use-case/courier/register-courier";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";

import { StorageModule } from "../../storage/storage.module";
import { AuthenticateCourierController } from "./authenticate-courier.controller";
import { RegisterCourierAccountController } from "./register-courier-account.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [RegisterCourierAccountController, AuthenticateCourierController],
  providers: [RegisterCourierUseCase, AuthenticateCourierUseCase],
})
export class CourierModule {}
