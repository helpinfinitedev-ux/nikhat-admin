export interface IOrder {
  _id?: string;
  userId: string;
  status: string;
  paymentStatus: string;
  amount: number;
  paymentDate: Date;
}
