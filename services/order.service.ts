import http from "./http.service";
import Promisable from "./promisable.service";
import { IOrder } from "@/interfaces/order";
export const OrderService = {
  getOrders: async () => {
    return await Promisable.asPromise(http.get("/api/orders"));
  },
  createOrder: async (order: Omit<IOrder, "id" | "createdAt" | "updatedAt">) => {
    return await Promisable.asPromise(http.post("/api/orders", order));
  },
};
