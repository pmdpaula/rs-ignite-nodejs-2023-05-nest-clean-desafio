import { Injectable } from "@nestjs/common";
import { Order, PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(order: Order): Promise<void> {}

  async findById(id: string): Promise<Order | null> {}

  async findByUserId(userId: string): Promise<Order[]> {}
}
