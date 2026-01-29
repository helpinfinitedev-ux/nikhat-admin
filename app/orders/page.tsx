"use client";

import AdminLayout from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { IOrder } from "@/interfaces";
import { DollarSign, Calendar, User, CreditCard } from "lucide-react";

const sampleOrders: IOrder[] = [
  {
    userId: "user_123",
    status: "Completed",
    paymentStatus: "Paid",
    amount: 299.99,
    paymentDate: new Date("2024-01-15"),
  },
  {
    userId: "user_456",
    status: "Processing",
    paymentStatus: "Paid",
    amount: 149.99,
    paymentDate: new Date("2024-01-20"),
  },
  {
    userId: "user_789",
    status: "Pending",
    paymentStatus: "Pending",
    amount: 89.99,
    paymentDate: new Date("2024-01-25"),
  },
  {
    userId: "user_321",
    status: "Completed",
    paymentStatus: "Paid",
    amount: 199.99,
    paymentDate: new Date("2024-01-18"),
  },
  {
    userId: "user_654",
    status: "Shipped",
    paymentStatus: "Paid",
    amount: 349.99,
    paymentDate: new Date("2024-01-22"),
  },
];

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
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function OrdersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage customer orders</p>
        </div>

        <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.paymentDate.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {sampleOrders.map((order, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{order.userId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Payment</span>
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">${order.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {order.paymentDate.toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
