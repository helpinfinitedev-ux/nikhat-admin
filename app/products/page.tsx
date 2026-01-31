"use client";

import { useContext, useEffect, useState } from "react";
import AdminLayout from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Package, Plus } from "lucide-react";
import ProductsList from "./_components/products-list";
import { ProductsService } from "@/services/products.service";
import { toast } from "sonner";
import { IProduct } from "@/interfaces";
import { ProductContext, useProducts } from "@/context/products";
import { uploadImage } from "@/utils/firebase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "./_constants";

export default function ProductsPage() {
  const { products, loading, setTrigger } = useProducts();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<IProduct>({
    name: "",
    description: "",
    price: 0,
    offer: 0,
    category: "",
    boughtQuantity: 0,
    imageUrls: [""],
    discountedPrice: 0,
  });
  const [uploading, setUploading] = useState<Record<number, boolean>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  useEffect(() => {
    const price = Number(formData.price) || 0;
    const offer = Math.min(Math.max(Number(formData.offer) || 0, 0), 100);
    const discounted = offer > 0 ? price - price * (offer / 100) : price;
    const normalized = Number.isFinite(discounted) ? Number(discounted.toFixed(2)) : 0;
    if (formData.discountedPrice !== normalized) {
      setFormData((prev) => ({ ...prev, discountedPrice: normalized }));
    }
  }, [formData.price, formData.offer, formData.discountedPrice]);

  const handleImageUrlChange = (index: number, value: string) => {
    setFormData((prev) => {
      const nextUrls = [...(prev.imageUrls || [])];
      nextUrls[index] = value;
      return { ...prev, imageUrls: nextUrls };
    });
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, imageUrls: [...(prev.imageUrls || []), ""] }));
  };

  const removeImageField = (index: number) => {
    setFormData((prev) => {
      const nextUrls = [...(prev.imageUrls || [])];
      nextUrls.splice(index, 1);
      return { ...prev, imageUrls: nextUrls.length ? nextUrls : [""] };
    });
  };

  const handleImageUpload = async (index: number, file?: File | null) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [index]: true }));
    try {
      const url = (await uploadImage(file)) as string;
      handleImageUrlChange(index, url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ...formData,
      imageUrls: (formData.imageUrls || []).map((url) => url.trim()).filter(Boolean),
    };
    const [response, error] = await ProductsService.createProduct(payload);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Product created successfully");
      setTrigger((prev: boolean) => !prev);
    }
    setOpen(false);
    setFormData({
      name: "",
      description: "",
      price: 0,
      offer: 0,
      category: "",
      boughtQuantity: 0,
      imageUrls: [""],
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

                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" placeholder="0.00" step="0.01" value={formData.price} onChange={handleInputChange} name="price" />
                  <p className="text-sm text-gray-500">
                    Discounted price: <span className="font-medium text-gray-900">{formData.discountedPrice}</span>
                  </p>
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
                  <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label>Image Links</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addImageField}>
                      Add Image
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {(formData.imageUrls || [""]).map((url, index) => (
                      <div key={index} className="flex flex-col gap-2 md:flex-row md:items-center">
                        <Input placeholder="https://example.com/image.jpg" value={url} onChange={(e) => handleImageUrlChange(index, e.target.value)} />
                        <div className="flex items-center gap-2">
                          <Input type="file" accept="image/*" className="w-full md:w-[220px]" disabled={!!uploading[index]} onChange={(e) => handleImageUpload(index, e.target.files?.[0])} />
                          {uploading[index] && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
                          <Button type="button" variant="outline" size="sm" onClick={() => removeImageField(index)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
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
