export interface IOrder {
  userId: string;
  status: string;
  paymentStatus: string;
  amount: number;
  paymentDate: Date;
}
