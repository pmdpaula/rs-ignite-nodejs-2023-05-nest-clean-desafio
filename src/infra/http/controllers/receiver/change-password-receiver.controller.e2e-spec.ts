import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";
import { ReceiverFactory } from "test/factories/make-receiver";

import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { HashComparer } from "@/domain/delivery/application/cryptography/hash-comparer";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe(
  "Edit Receiver (E2E)",
  () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let jwt: JwtService;
    let receiverFactory: ReceiverFactory;
    let courierFactory: CourierFactory;
    let hashComparer: HashComparer;

    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule, DatabaseModule],
        providers: [ReceiverFactory, CourierFactory],
      }).compile();

      app = moduleRef.createNestApplication();

      prisma = moduleRef.get(PrismaService);
      receiverFactory = moduleRef.get(ReceiverFactory);
      courierFactory = moduleRef.get(CourierFactory);
      jwt = moduleRef.get(JwtService);
      hashComparer = moduleRef.get(HashComparer);

      await app.init();
    });

    test("[PUT] /receiver/password/:id", async () => {
      const receiver = await receiverFactory.makePrismaReceiver({
        name: "Receiver 1",
        phone: "21999",
        password: "123456",
      });

      const receiverId = receiver.id.toString();

      const password = "987654";

      const receiverAdmin = await courierFactory.makePrismaCourier({
        name: "Admin 01",
        registerNumber: "0000",
        password: "123",
        role: "ADMIN",
      });

      const accessTokenAdmin = jwt.sign({ sub: receiverAdmin.id.toString() });

      const response = await request(app.getHttpServer())
        .put(`/receiver/password/${receiverId}`)
        .auth("0000", "123")
        .set("Authorization", `Bearer ${accessTokenAdmin}`)
        .send({
          password,
        });

      // Expect change is sucessful
      expect(response.statusCode).toBe(204);

      const receiverOnDatabase = await prisma.receiver.findUnique({
        where: {
          id: receiverId,
        },
      });

      if (!receiverOnDatabase) {
        throw new ResourceNotFoundError();
      }

      const isPasswordValid = await hashComparer.compare(
        password,
        receiverOnDatabase?.password,
      );

      // Expect password was changed
      expect(isPasswordValid).toBeTruthy();
    });
  },
  {
    timeout: 50000,
  },
);
