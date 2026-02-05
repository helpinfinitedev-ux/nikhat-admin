"use client";

import AdminLayout from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { IOrder } from "@/interfaces";
import { DollarSign, Calendar, User, Loader2 } from "lucide-react";
import { useOrders } from "@/context/order";
import { OrderService } from "@/services/order.service";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Refunded"];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "refunded":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function OrdersPage() {
  const { orders, loading, setOrders } = useOrders();
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);

  const formatDate = (value: Date | string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString();
  };

  const updateOrderField = async (order: IOrder, key: "status" | "paymentStatus", value: string) => {
    if (!order._id || order[key] === value) return;
    setSavingOrderId(order._id);
    const [response, error] = await OrderService.updateOrder(order._id, { [key]: value });
    if (error) {
      toast.error(error.message || "Failed to update order");
      setSavingOrderId(null);
      return;
    }

    const updatedOrder = response?.data?.data;
    if (updatedOrder?._id) {
      setOrders(orders.map((item) => (item._id === updatedOrder._id ? updatedOrder : item)));
    }
    toast.success("Order updated");
    setSavingOrderId(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage customer orders</p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Fetching orders...
          </div>
        )}

        <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order: any) => (
                <tr key={order._id || `${order.userId}-${order.paymentDate}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{String(order.user?.name)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                      <Select value={order.status} onValueChange={(value) => updateOrderField(order, "status", value)} disabled={savingOrderId === order._id}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span>
                      <Select value={order.paymentStatus} onValueChange={(value) => updateOrderField(order, "paymentStatus", value)} disabled={savingOrderId === order._id}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_STATUSES.map((status) => (
                            <SelectItem key={status} value={status.toLowerCase()}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs.{order.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.paymentDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {orders.map((order: any) => (
            <Card key={order._id || `${order.userId}-${order.paymentDate}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{String(order.user?.name)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>
                <Select value={order.status} onValueChange={(value) => updateOrderField(order, "status", value)} disabled={savingOrderId === order._id}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Payment</span>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span>
                </div>
                <Select value={order.paymentStatus} onValueChange={(value) => updateOrderField(order, "paymentStatus", value)} disabled={savingOrderId === order._id}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">${order.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {formatDate(order.paymentDate)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {!loading && orders.length === 0 && <p className="text-sm text-gray-500">No orders found.</p>}
      </div>
    </AdminLayout>
  );
}
