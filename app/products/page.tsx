"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Package } from "lucide-react";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">Manage your products</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the product details below
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" placeholder="Enter product name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountedPrice">Discounted Price</Label>
                    <Input
                      id="discountedPrice"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="offer">Offer (%)</Label>
                    <Input
                      id="offer"
                      type="number"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="boughtQuantity">Bought Quantity</Label>
                    <Input
                      id="boughtQuantity"
                      type="number"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="Enter category" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrls">Image URLs</Label>
                  <Textarea
                    id="imageUrls"
                    placeholder="Enter image URLs (one per line)"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Product</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                No products yet
              </h3>
              <p className="text-gray-500 max-w-md">
                Get started by adding your first product using the button above
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
