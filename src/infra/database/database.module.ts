import { Module } from "@nestjs/common";

import { CouriersRepository } from "@/domain/delivery/application/repositories/couriers-repository";
import { ReceiversRepository } from "@/domain/delivery/application/repositories/receivers-repository";

import { PrismaService } from "./prisma/prisma.service";
import { PrismaCouriersRepository } from "./prisma/repositories/prisma-couriers-repository";
import { PrismaReceiversRepository } from "./prisma/repositories/prisma-receivers-repository";

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: CouriersRepository,
      useClass: PrismaCouriersRepository,
    },
    {
      provide: ReceiversRepository,
      useClass: PrismaReceiversRepository,
    },
  ],
  exports: [PrismaService, CouriersRepository, ReceiversRepository],
})
export class DatabaseModule {}
