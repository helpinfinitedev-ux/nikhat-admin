export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  offer: number;
  category: string;
  boughtQuantity: number;
  imageUrls: string[];
  discountedPrice: number;
}
