import { Dispatch, SetStateAction } from "react";

export interface CustomerData {
  bank: string;
  customerName: string;
  fatherName: string;
  accountNumber: string;
  ifsc: string;
  mobile: string;
  cif: string;
  address: string;
  photo: string;
}

export interface Bank {
  id: string;
  name: string;
  logo: string;
  color: string;
  textColor: string;
  ifscPrefix: string;
}
export interface CustomerFormProps {
  customer: CustomerData;
  setCustomer: Dispatch<SetStateAction<CustomerData>>;
}

export interface PassbookPreviewProps {
  customer: CustomerData;
}