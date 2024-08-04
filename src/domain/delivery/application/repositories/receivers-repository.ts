/* eslint-disable no-unused-vars */
import { Receiver } from "../../enterprise/entities/receiver";

export abstract class ReceiversRepository {
  abstract findById(id: string): Promise<Receiver | null>;
  abstract findByPhone(phone: string): Promise<Receiver | null>;
  abstract create(receiver: Receiver): Promise<void>;
  abstract save(receiver: Receiver): Promise<void>;
}
