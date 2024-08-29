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
import { DeleteCourierUseCase } from "@/domain/delivery/application/use-case/courier/delete-courier";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/courier/:id")
export class DeleteCourierController {
  constructor(
    // eslint-disable-next-line
    private deleteCourier: DeleteCourierUseCase,
    // eslint-disable-next-line
    private couriersRepository: CouriersRepository,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param("id") courierId: string) {
    const userId = user.sub;
    const currentUser = await this.couriersRepository.findById(userId);

    if (!currentUser) {
      throw new ResourceNotFoundError();
    }

    if (!currentUser || currentUser.role !== "ADMIN") {
      throw new UnauthorizedException();
    }

    const result = await this.deleteCourier.execute({ courierId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
