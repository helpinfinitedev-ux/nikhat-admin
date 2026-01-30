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
};
