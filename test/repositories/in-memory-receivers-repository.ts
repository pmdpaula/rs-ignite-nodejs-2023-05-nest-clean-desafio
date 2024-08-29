import { DomainEvents } from "@/core/events/domain-events";
import { ReceiversRepository } from "@/domain/delivery/application/repositories/receivers-repository";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";

export class InMemoryReceiversRepository implements ReceiversRepository {
  public items: Receiver[] = [];

  async create(receiver: Receiver) {
    this.items.push(receiver);

    DomainEvents.dispatchEventsForAggregate(receiver.id);
  }

  async findById(id: string): Promise<Receiver | null> {
    const receiver = this.items.find((item) => item.id.toString() === id);

    if (!receiver) {
      return null;
    }

    return receiver;
  }

  async findByPhone(phone: string): Promise<Receiver | null> {
    const receiver = this.items.find((item) => item.phone === phone);

    if (!receiver) {
      return null;
    }

    return receiver;
  }

  async save(receiver: Receiver): Promise<void> {
    const receiverIndex = this.items.findIndex((item) => item.id === receiver.id);

    this.items[receiverIndex] = receiver;
  }

  async delete(receiver: Receiver): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === receiver.id);

    this.items.splice(itemIndex, 1);
  }
}
