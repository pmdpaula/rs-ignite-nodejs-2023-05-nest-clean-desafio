import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("DeleteCourierController", () => {
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

  test("[DELETE] /courier/:id", async () => {
    const courier = await courierFactory.makePrismaCourier({
      name: "Courier 1",
      registerNumber: "1234",
      role: "COURIER",
      password: "789",
    });

    const courierAdmin = await courierFactory.makePrismaCourier({
      name: "Admin 01",
      registerNumber: "0000",
      password: "123",
      role: "ADMIN",
    });

    const courierId = courier.id.toString();
    const accessToken = jwt.sign({ sub: courier.id.toString() });

    const responseError = await request(app.getHttpServer())
      .delete(`/courier/${courierId}`)
      .auth("1234", "789")
      .set("Authorization", `Bearer ${accessToken}`);

    // The status code should be 401 because the courier in auth is not an admin
    expect(responseError.statusCode).toBe(401);

    const accessTokenAdmin = jwt.sign({ sub: courierAdmin.id.toString() });

    const responseAdmin = await request(app.getHttpServer())
      .delete(`/courier/${courierId}`)
      .auth("0000", "123")
      .set("Authorization", `Bearer ${accessTokenAdmin}`);

    // The status code should be 204 because the courier in auth is an admin
    expect(responseAdmin.statusCode).toBe(204);

    const couriersOnDatabase = await prisma.user.findMany();

    expect(couriersOnDatabase).toHaveLength(1);
  });
});
