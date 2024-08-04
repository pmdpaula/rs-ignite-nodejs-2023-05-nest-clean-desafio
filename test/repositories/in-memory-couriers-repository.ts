import { DomainEvents } from "@/core/events/domain-events";
import { CouriersRepository } from "@/domain/delivery/application/repositories/couriers-repository";
import { Courier } from "@/domain/delivery/enterprise/entities/courier";

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = [];

  async findByRegisterNumber(registerNumber: string) {
    const courier = this.items.find((item) => item.registerNumber === registerNumber);

    if (!courier) {
      return null;
    }

    return courier;
  }

  async create(courier: Courier) {
    this.items.push(courier);

    DomainEvents.dispatchEventsForAggregate(courier.id);
  }
}
