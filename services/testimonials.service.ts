import { ICustomerRating } from "@/interfaces";
import http from "./http.service";
import Promisable from "./promisable.service";

export const TestimonialsService = {
  getTestimonials: async () => {
    return await Promisable.asPromise(http.get("/api/ratings"));
  },
  createRating: async (rating: Omit<ICustomerRating, "date">) => {
    return await Promisable.asPromise(http.post("/api/ratings", rating));
  },
  updateRating: async (id: string, rating: Partial<ICustomerRating>) => {
    return await Promisable.asPromise(http.put(`/api/ratings/${id}`, rating));
  },
  deleteRating: async (id: string) => {
    return await Promisable.asPromise(http.delete(`/api/ratings/${id}`));
  },
};
