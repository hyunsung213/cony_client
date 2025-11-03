export interface Payment {
  paymentId: number;
  gameId: number;
  userName: string;
  userPhoneNum: string;
  userEmail: string;
  isConfirmed: boolean;
}

export interface IPayment {
  gameId: number;
  userName: string;
  userPhoneNum: string;
  userEmail: string;
}

export interface PaymentConfirm {
  gameId: number;
  userPhoneNum: string;
}
