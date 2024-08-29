import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
} from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { z } from "zod";

import { CouriersRepository } from "@/domain/delivery/application/repositories/couriers-repository";
import { EditCourierUseCase } from "@/domain/delivery/application/use-case/courier/edit-courier";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const editCourierBodySchema = z.object({
  name: z.string(),
  role: z.enum(["ADMIN", "COURIER"]),
});

const bodyValidationPipe = new ZodValidationPipe(editCourierBodySchema);

type EditCourierBodySchema = z.infer<typeof editCourierBodySchema>;

@Controller("/courier/:id")
export class EditCourierController {
  constructor(
    // eslint-disable-next-line
    private editCourier: EditCourierUseCase,
    // eslint-disable-next-line
    private couriersRepository: CouriersRepository,
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditCourierBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") courierId: string,
  ) {
    const { name, role } = body;
    const userId = user.sub;
    const currentUser = await this.couriersRepository.findById(userId);

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException();
    }

    const result = await this.editCourier.execute({
      id: courierId,
      name,
      role,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
