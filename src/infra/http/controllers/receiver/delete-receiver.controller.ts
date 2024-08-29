import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
} from "@nestjs/common";

import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { CouriersRepository } from "@/domain/delivery/application/repositories/couriers-repository";
import { DeleteReceiverUseCase } from "@/domain/delivery/application/use-case/receiver/delete-receiver";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/receiver/:id")
export class DeleteReceiverController {
  constructor(
    // eslint-disable-next-line
    private deleteReceiver: DeleteReceiverUseCase,
    // eslint-disable-next-line
    private couriersRepository: CouriersRepository,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param("id") receiverId: string) {
    const userId = user.sub;
    const currentUser = await this.couriersRepository.findById(userId);

    if (!currentUser) {
      throw new ResourceNotFoundError();
    }

    if (!currentUser || currentUser.role !== "ADMIN") {
      throw new UnauthorizedException();
    }

    const result = await this.deleteReceiver.execute({ receiverId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
