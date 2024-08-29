import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UnauthorizedException,
} from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { z } from "zod";

import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { CouriersRepository } from "@/domain/delivery/application/repositories/couriers-repository";
import { ChangePasswordCourierUseCase } from "@/domain/delivery/application/use-case/courier/change-password-courier";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const changePasswordCourierBodySchema = z.object({
  password: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(changePasswordCourierBodySchema);

type ChangePasswordCourierBodySchema = z.infer<typeof changePasswordCourierBodySchema>;

@Controller("/courier/password/:id")
export class ChangePasswordCourierController {
  constructor(
    // eslint-disable-next-line
    private changePasswordCourier: ChangePasswordCourierUseCase,
    // eslint-disable-next-line
    private couriersRepository: CouriersRepository,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ChangePasswordCourierBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") courierId: string,
  ) {
    const { password } = body;
    const userId = user.sub;
    const currentUser = await this.couriersRepository.findById(userId);

    if (!currentUser) {
      throw new ResourceNotFoundError();
    }

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException();
    }

    const result = await this.changePasswordCourier.execute({
      id: courierId,
      password,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
