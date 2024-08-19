import { BadRequestException, Controller, Get, Param } from "@nestjs/common";

import { GetReceiverByPhoneUseCase } from "@/domain/delivery/application/use-case/receiver/get-receiver-by-phone";

@Controller("/receiver/phone/:phone")
export class GetReceiverByPhoneController {
  // eslint-disable-next-line no-unused-vars
  constructor(private getReceiverByPhone: GetReceiverByPhoneUseCase) {}

  @Get()
  async handle(@Param("phone") phone: string) {
    const result = await this.getReceiverByPhone.execute(phone);

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { receiver: result.value.receiver };
  }
}
