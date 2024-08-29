import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";

import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { HashComparer } from "@/domain/delivery/application/cryptography/hash-comparer";
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
    let hashComparer: HashComparer;

    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule, DatabaseModule],
        providers: [CourierFactory],
      }).compile();

      app = moduleRef.createNestApplication();

      prisma = moduleRef.get(PrismaService);
      courierFactory = moduleRef.get(CourierFactory);
      jwt = moduleRef.get(JwtService);
      hashComparer = moduleRef.get(HashComparer);

      await app.init();
    });

    test("[PATCH] /courier/password/:id", async () => {
      const courier = await courierFactory.makePrismaCourier({
        name: "Courier 1",
        registerNumber: "1234",
        role: "COURIER",
        password: "123456",
      });

      const courierId = courier.id.toString();
      const accessToken = jwt.sign({ sub: courier.id.toString() });

      const password = "987654";

      const responseError = await request(app.getHttpServer())
        .patch(`/courier/password/${courierId}`)
        .auth("1234", "123456")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          password,
        });

      // Expect unauthorized
      expect(responseError.statusCode).toBe(401);

      const courierAdmin = await courierFactory.makePrismaCourier({
        name: "Admin 01",
        registerNumber: "0000",
        password: "123",
        role: "ADMIN",
      });

      const accessTokenAdmin = jwt.sign({ sub: courierAdmin.id.toString() });

      const response = await request(app.getHttpServer())
        .patch(`/courier/password/${courierId}`)
        .auth("0000", "123")
        .set("Authorization", `Bearer ${accessTokenAdmin}`)
        .send({
          password,
        });

      // Expect change is sucessful
      expect(response.statusCode).toBe(204);

      const courierOnDatabase = await prisma.user.findUnique({
        where: {
          id: courier.id.toString(),
        },
      });

      if (!courierOnDatabase) {
        throw new ResourceNotFoundError();
      }

      const isPasswordValid = await hashComparer.compare(
        password,
        courierOnDatabase?.password,
      );

      // Expect password was changed
      expect(isPasswordValid).toBeTruthy();
    });
  },
  {
    timeout: 5000,
  },
);
