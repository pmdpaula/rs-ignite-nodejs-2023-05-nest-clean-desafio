import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";
import { ReceiverFactory } from "test/factories/make-receiver";

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

      await app.init();
    });

    test("[PUT] /receiver/:id", async () => {
      const receiver = await receiverFactory.makePrismaReceiver({
        name: "Receiver 1",
        phone: "219999",
      });

      const courierAdmin = await courierFactory.makePrismaCourier({
        name: "Admin 01",
        registerNumber: "0000",
        password: "123",
        role: "ADMIN",
      });

      const receiverId = receiver.id.toString();
      const accessToken = jwt.sign({ sub: courierAdmin.id.toString() });

      const response = await request(app.getHttpServer())
        .put(`/receiver/${receiverId}`)
        .auth("0000", "123")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Pedro de Paula",
          phone: "218888",
        });

      expect(response.statusCode).toBe(204);

      const receiverOnDatabase = await prisma.receiver.findFirst({
        where: {
          name: "Pedro de Paula",
        },
      });

      expect(receiverOnDatabase).toBeTruthy();
      expect(receiverOnDatabase?.phone).toBe("218888");
    });
  },
  {
    timeout: 5000,
  },
);
