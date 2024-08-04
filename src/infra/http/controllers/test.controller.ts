import { Controller, Get } from "@nestjs/common";

import { Public } from "@/infra/auth/public";

@Controller("/test")
@Public()
export class TestController {
  constructor() {}

  @Get()
  async handle(): Promise<void> {
    console.log("TestController executado");
  }
}
