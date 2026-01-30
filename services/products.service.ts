import axios from "axios";
import { IProduct } from "../interfaces/product";
import Promisable from "./promisable.service";
import http from "./http.service";
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
export const ProductsService = {
  getProducts: async () => {
    return await Promisable.asPromise(http.get("/api/products"));
  },
  createProduct: async (product: IProduct) => {
    return await Promisable.asPromise(http.post("/api/products", product));
  },
};
