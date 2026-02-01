"use client";

import { useContext, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { ProductContext } from "@/context/products";
import { Package, Loader2, Trash2, Pencil } from "lucide-react";
import { ProductsService } from "@/services/products.service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IProduct } from "@/interfaces";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "../../_constants";
import { uploadImage } from "@/utils/firebase";

export default function ProductsList() {
  const context = useContext(ProductContext);

  if (!context) {
    return null;
  }

  const { products, loading, setProducts } = context;
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
  const [editOpen, setEditOpen] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editData, setEditData] = useState<IProduct | null>(null);
  const [editUploading, setEditUploading] = useState<Record<number, boolean>>({});

  const categoryOptions = useMemo(() => categories.filter((category) => category.value !== "all"), []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">No products yet</h3>
            <p className="text-gray-500 max-w-md">
              Get started by adding your first product using the button above
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = async (productId?: string) => {
    if (!productId) {
      toast.error("Missing product id");
      return;
    }
    const confirmed = window.confirm("Delete this product? This action cannot be undone.");
    if (!confirmed) return;

    setDeleting((prev) => ({ ...prev, [productId]: true }));
    const [, error] = await ProductsService.deleteProduct(productId);
    if (error) {
      toast.error(error.message || "Failed to delete product");
      setDeleting((prev) => ({ ...prev, [productId]: false }));
      return;
    }
    setProducts((prev) => prev.filter((product) => product._id !== productId));
    setDeleting((prev) => ({ ...prev, [productId]: false }));
  };

  const computeDiscountedPrice = (price: number, offer: number) => {
    const normalizedOffer = Math.min(Math.max(Number(offer) || 0, 0), 100);
    const normalizedPrice = Number(price) || 0;
    const discounted = normalizedOffer > 0 ? normalizedPrice - normalizedPrice * (normalizedOffer / 100) : normalizedPrice;
    return Number.isFinite(discounted) ? Number(discounted.toFixed(2)) : 0;
  };

  const handleEditOpen = (product: IProduct) => {
    setEditData({
      ...product,
      imageUrls: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [""],
    });
    setEditOpen(true);
  };

  const handleEditImageUrlChange = (index: number, value: string) => {
    setEditData((prev) => {
      if (!prev) return prev;
      const nextUrls = [...(prev.imageUrls || [])];
      nextUrls[index] = value;
      return { ...prev, imageUrls: nextUrls };
    });
  };

  const addEditImageField = () => {
    setEditData((prev) => (prev ? { ...prev, imageUrls: [...(prev.imageUrls || []), ""] } : prev));
  };

  const removeEditImageField = (index: number) => {
    setEditData((prev) => {
      if (!prev) return prev;
      const nextUrls = [...(prev.imageUrls || [])];
      nextUrls.splice(index, 1);
      return { ...prev, imageUrls: nextUrls.length ? nextUrls : [""] };
    });
  };

  const handleEditImageUpload = async (index: number, file?: File | null) => {
    if (!file) return;
    setEditUploading((prev) => ({ ...prev, [index]: true }));
    try {
      const url = (await uploadImage(file)) as string;
      handleEditImageUrlChange(index, url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setEditUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setEditData((prev) =>
      prev
        ? {
            ...prev,
            [name]: type === "number" ? Number(value) : value,
          }
        : prev
    );
  };

  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editData?._id) {
      toast.error("Missing product id");
      return;
    }
    setEditSubmitting(true);

    const payload: IProduct = {
      ...editData,
      offer: Math.min(Math.max(Number(editData.offer) || 0, 0), 100),
      imageUrls: (editData.imageUrls || []).map((url) => url.trim()).filter(Boolean),
    };
    payload.discountedPrice = computeDiscountedPrice(payload.price, payload.offer);

    const [response, error] = await ProductsService.updateProduct(editData._id, payload);
    if (error) {
      toast.error(error.message || "Failed to update product");
      setEditSubmitting(false);
      return;
    }

    const updatedProduct = response?.data?.data || payload;
    setProducts((prev) => prev.map((product) => (product._id === editData._id ? updatedProduct : product)));
    setEditSubmitting(false);
    setEditOpen(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditData(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details below</DialogDescription>
          </DialogHeader>
          {editData && (
            <form className="space-y-4 mt-4" onSubmit={handleEditSubmit}>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input id="edit-name" placeholder="Enter product name" value={editData.name} onChange={handleEditChange} name="name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" placeholder="Enter product description" rows={3} value={editData.description} onChange={handleEditChange} name="description" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input id="edit-price" type="number" placeholder="0.00" step="0.01" value={editData.price} onChange={handleEditChange} name="price" />
                <p className="text-sm text-gray-500">
                  Discounted price: <span className="font-medium text-gray-900">{computeDiscountedPrice(editData.price, editData.offer)}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-offer">Offer (%)</Label>
                  <Input id="edit-offer" type="number" placeholder="0" min="0" max="100" value={editData.offer} onChange={handleEditChange} name="offer" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-boughtQuantity">Bought Quantity</Label>
                  <Input id="edit-boughtQuantity" type="number" placeholder="0" min="0" value={editData.boughtQuantity} onChange={handleEditChange} name="boughtQuantity" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={editData.category} onValueChange={(value) => setEditData((prev) => (prev ? { ...prev, category: value } : prev))}>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
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
                  <Button type="button" variant="outline" size="sm" onClick={addEditImageField}>
                    Add Image
                  </Button>
                </div>
                <div className="space-y-3">
                  {(editData.imageUrls || [""]).map((url, index) => (
                    <div key={index} className="flex flex-col gap-2 md:flex-row md:items-center">
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={url}
                        onChange={(e) => handleEditImageUrlChange(index, e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          className="w-full md:w-[220px]"
                          disabled={!!editUploading[index]}
                          onChange={(e) => handleEditImageUpload(index, e.target.files?.[0])}
                        />
                        {editUploading[index] && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
                        <Button type="button" variant="outline" size="sm" onClick={() => removeEditImageField(index)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={editSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={editSubmitting}>
                  {editSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Offer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sold
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product, index) => {
              const isDeleting = !!(product._id && deleting[product._id]);

              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.imageUrls && product.imageUrls.length > 0 ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover bg-gray-100"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">
                      {product.discountedPrice > 0 ? (
                        <>
                          <span className="font-medium">₹{product.discountedPrice}</span>
                          <span className="text-sm text-gray-400 line-through ml-2">
                            ₹{product.price}
                          </span>
                        </>
                      ) : (
                        <span className="font-medium">₹{product.price}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.offer > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {product.offer}% OFF
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {product.boughtQuantity}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!product._id}
                        onClick={() => handleEditOpen(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={!product._id || isDeleting}
                        onClick={() => handleDelete(product._id)}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
