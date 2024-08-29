import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe(
  "Edit Courier (E2E)",
  () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let jwt: JwtService;
    let courierFactory: CourierFactory;

    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule, DatabaseModule],
        providers: [CourierFactory],
      }).compile();

      app = moduleRef.createNestApplication();

      prisma = moduleRef.get(PrismaService);
      courierFactory = moduleRef.get(CourierFactory);
      jwt = moduleRef.get(JwtService);

      await app.init();
    });

    test("[PUT] /courier/:id", async () => {
      const courier = await courierFactory.makePrismaCourier({
        name: "Courier 1",
        role: "COURIER",
      });

      const courierAdmin = await courierFactory.makePrismaCourier({
        name: "Admin 01",
        registerNumber: "0000",
        password: "123",
        role: "ADMIN",
      });

      const courierId = courier.id.toString();
      const accessToken = jwt.sign({ sub: courierAdmin.id.toString() });

      const response = await request(app.getHttpServer())
        .put(`/courier/${courierId}`)
        .auth("0000", "123")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Pedro de Paula",
          role: "COURIER",
        });

      expect(response.statusCode).toBe(204);

      const courierOnDatabase = await prisma.user.findFirst({
        where: {
          name: "Pedro de Paula",
        },
      });

      expect(courierOnDatabase).toBeTruthy();
    });
  },
  {
    timeout: 50000,
  },
);
