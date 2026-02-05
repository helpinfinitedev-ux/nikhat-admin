"use client";
import { IOrder } from "@/interfaces/order";
import { OrderService } from "@/services/order.service";
import { createContext, useContext, useEffect, useState } from "react";

type OrderContextType = {
  orders: IOrder[];
  setOrders: (orders: IOrder[]) => void;
  loading: boolean;
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

export const OrderContext = createContext<OrderContextType>({
  orders: [],
  setOrders: () => {},
  loading: false,
  trigger: false,
  setTrigger: () => {},
});

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const fetchOrders = async () => {
    setLoading(true);
    const [response, error] = await OrderService.getOrders();
    if (error) {
      console.error("Error fetching orders:", error.message);
    } else {
      setOrders(response?.data?.data || []);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchOrders();
  }, [trigger]);
  return <OrderContext.Provider value={{ orders, setOrders, loading, trigger, setTrigger }}>{children}</OrderContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within a OrderProvider");
  }
  return context;
};
