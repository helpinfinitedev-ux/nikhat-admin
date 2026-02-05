import http from "./http.service";
import Promisable from "./promisable.service";
import { IOrder } from "@/interfaces/order";
export const OrderService = {
  getOrders: async () => {
    http.setJWT();
    return await Promisable.asPromise(http.get("/api/orders"));
  },
  createOrder: async (order: Omit<IOrder, "id" | "createdAt" | "updatedAt">) => {
    http.setJWT();
    return await Promisable.asPromise(http.post("/api/orders", order));
  },
  updateOrder: async (id: string, payload: Partial<Pick<IOrder, "status" | "paymentStatus">>) => {
    http.setJWT();
    return await Promisable.asPromise(http.put(`/api/orders/${id}`, payload));
  },
};
