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
import { ReceiversRepository } from "@/domain/delivery/application/repositories/receivers-repository";
import { EditReceiverUseCase } from "@/domain/delivery/application/use-case/receiver/edit-receiver";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const editReceiverBodySchema = z.object({
  name: z.string(),
  phone: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editReceiverBodySchema);

type EditReceiverBodySchema = z.infer<typeof editReceiverBodySchema>;

@Controller("/receiver/:id")
export class EditReceiverController {
  constructor(
    // eslint-disable-next-line
    private editReceiver: EditReceiverUseCase,
    // eslint-disable-next-line
    private receiversRepository: ReceiversRepository,
    // eslint-disable-next-line
    private couriersRepository: CouriersRepository,
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditReceiverBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") receiverId: string,
  ) {
    const { name, phone } = body;
    const userId = user.sub;
    const currentUser = await this.couriersRepository.findById(userId);

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException();
    }

    const result = await this.editReceiver.execute({
      id: receiverId,
      name,
      phone,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
