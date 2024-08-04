import { Injectable } from "@nestjs/common";

import { Either, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order } from "@/domain/delivery/enterprise/entities/order";

import { OrdersRepository } from "../../repositories/orders-repository";

interface CreateOrderUseCaseRequest {
  authorId: string;
  address: string;
  latitude: number;
  longitude: number;
}

type CreateOrderUseCaseResponse = Either<
  null,
  {
    order: Order;
  }
>;

@Injectable()
export class CreateOrderUseCase {
  // eslint-disable-next-line no-unused-vars
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    authorId,
    address,
    latitude,
    longitude,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const order = Order.create({
      authorId: new UniqueEntityID(authorId),
      address,
      latitude,
      longitude,
      status: "PENDING",
      attachments: [],
      courierId: null,
    });

    await this.ordersRepository.create(order);

    return right({
      order,
    });
  }
}
