import { Module } from "@nestjs/common";

import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { CourierModule } from "./controllers/courier/courier.module";
import { ReceiverModule } from "./controllers/receiver/receiver.module";
import { StorageModule } from "./storage/storage.module";

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    StorageModule,
    ReceiverModule,
    CourierModule,
  ],
  // providers: [ReceiverModule, CourierModule],
})
export class HttpModule {}
