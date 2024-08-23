import { DomainEvents } from "@/core/events/domain-events";
import { CouriersRepository } from "@/domain/delivery/application/repositories/couriers-repository";
import { Courier } from "@/domain/delivery/enterprise/entities/courier";

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = [];

  async create(courier: Courier) {
    this.items.push(courier);

    DomainEvents.dispatchEventsForAggregate(courier.id);
  }

  async findById(id: string) {
    const courier = this.items.find((item) => item.id.toString() === id);

    if (!courier) {
      return null;
    }

    return courier;
  }

  async findByRegisterNumber(registerNumber: string) {
    const courier = this.items.find((item) => item.registerNumber === registerNumber);

    if (!courier) {
      return null;
    }

    return courier;
  }

  async save(courier: Courier): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === courier.id);

    this.items[itemIndex] = courier;
  }

  async delete(courier: Courier): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === courier.id);

    this.items.splice(itemIndex, 1);
  }
}
