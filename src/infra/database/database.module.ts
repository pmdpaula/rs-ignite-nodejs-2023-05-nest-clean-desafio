import { Module } from "@nestjs/common";

import { CouriersRepository } from "@/domain/delivery/application/repositories/couriers-repository";

import { PrismaService } from "./prisma/prisma.service";
import { PrismaCouriersRepository } from "./prisma/repositories/prisma-couriers-repository";

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: CouriersRepository,
      useClass: PrismaCouriersRepository,
    },
  ],
  exports: [PrismaService, CouriersRepository],
})
export class DatabaseModule {}
