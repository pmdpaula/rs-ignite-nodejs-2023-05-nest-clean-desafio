/* eslint-disable no-unused-vars */

import { Courier } from "../../enterprise/entities/courier";
import { Order } from "../../enterprise/entities/order";

export interface FindNearbyOrdersRequest {
  latitude: number;
  longitude: number;
}

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<void>;
  abstract findNearby({
    latitude,
    longitude,
  }: FindNearbyOrdersRequest): Promise<Courier[] | null>;
  abstract changeStatus(orderId: string, status: string): Promise<void>;
}
