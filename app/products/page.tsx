"use client";

import { useContext, useState } from "react";
import AdminLayout from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, Plus } from "lucide-react";
import ProductsList from "./_components/products-list";
import { ProductsService } from "@/services/products.service";
import { toast } from "sonner";
import { IProduct } from "@/interfaces";
import { ProductContext } from "@/context/products";

export default function ProductsPage() {
  const { products, loading } = useContext(ProductContext);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<IProduct>({
    name: "",
    description: "",
    price: 0,
    offer: 0,
    category: "",
    boughtQuantity: 0,
    imageUrls: [],
    discountedPrice: 0,
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value as string });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [response, error] = await ProductsService.createProduct(formData);
    setLoading(true);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Product created successfully");
    }
    setOpen(false);
    setFormData({
      name: "",
      description: "",
      price: 0,
      offer: 0,
      category: "",
      boughtQuantity: 0,
      imageUrls: [],
      discountedPrice: 0,
    });
  };
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
                <DialogDescription>Fill in the product details below</DialogDescription>
              </DialogHeader>
              <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" placeholder="Enter product name" value={formData.name} onChange={handleInputChange} name="name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter product description" rows={3} value={formData.description} onChange={handleInputChange} name="description" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" placeholder="0.00" step="0.01" value={formData.price} onChange={handleInputChange} name="price" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountedPrice">Discounted Price</Label>
                    <Input id="discountedPrice" type="number" placeholder="0.00" step="0.01" value={formData.discountedPrice} onChange={handleInputChange} name="discountedPrice" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="offer">Offer (%)</Label>
                    <Input id="offer" type="number" placeholder="0" min="0" max="100" value={formData.offer} onChange={handleInputChange} name="offer" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="boughtQuantity">Bought Quantity</Label>
                    <Input id="boughtQuantity" type="number" placeholder="0" min="0" value={formData.boughtQuantity} onChange={handleInputChange} name="boughtQuantity" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="Enter category" value={formData.category} onChange={handleInputChange} name="category" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrls">Image URLs</Label>
                  <Textarea id="imageUrls" placeholder="Enter image URLs (one per line)" rows={3} value={formData.imageUrls.join("\n")} onChange={handleInputChange} name="imageUrls" />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Product</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {products?.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">No products yet</h3>
                <p className="text-gray-500 max-w-md">Get started by adding your first product using the button above</p>
              </div>
            </div>
          </div>
        ) : (
          <ProductsList />
        )}
      </div>
    </AdminLayout>
  );
}
