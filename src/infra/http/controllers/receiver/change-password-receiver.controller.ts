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

import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { CouriersRepository } from "@/domain/delivery/application/repositories/couriers-repository";
import { ReceiversRepository } from "@/domain/delivery/application/repositories/receivers-repository";
import { ChangePasswordReceiverUseCase } from "@/domain/delivery/application/use-case/receiver/change-password-receiver";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const changePasswordReceiverBodySchema = z.object({
  password: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(changePasswordReceiverBodySchema);

type ChangePasswordReceiverBodySchema = z.infer<typeof changePasswordReceiverBodySchema>;

@Controller("/receiver/password/:id")
export class ChangePasswordReceiverController {
  constructor(
    // eslint-disable-next-line
    private changePasswordReceiver: ChangePasswordReceiverUseCase,
    // eslint-disable-next-line
    private receiversRepository: ReceiversRepository,
    // eslint-disable-next-line
    private couriersRepository: CouriersRepository,
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ChangePasswordReceiverBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") receiverId: string,
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

    const result = await this.changePasswordReceiver.execute({
      id: receiverId,
      password,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
