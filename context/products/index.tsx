"use client";
import { IProduct } from "@/interfaces";
import { ProductsService } from "@/services/products.service";
import { createContext, useEffect, useState } from "react";

export const ProductContext = createContext<
  | {
      products: IProduct[];
      setProducts: (products: IProduct[]) => void;
      loading: boolean;
    }
  | undefined
>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const [response, error] = await ProductsService.getProducts();
      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(response?.data?.data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);
  return <ProductContext.Provider value={{ products, setProducts, loading }}>{children}</ProductContext.Provider>;
};
