import firebase from "firebase";
export interface IContact {
  id: string;
  firstName: string;
  lastName: string;
  number: string[];
  email?: string[];
  avatar: string;
}

export interface IGroup {
  id: string;
  name: string;
  description?: string;
  contactsLength: number;
  latestContacts: IContact[];
  contacts: string[];
}

export interface IOffer {
  smsCount: number;
  originalPrice: number;
  price: number;
  items: string[];
}

export interface IUser {
  uid: string;
  companyName: string;
  authEmail: string;
  lastName: string;
  number: string;
  usedSMS: number;
  activities: string[]; //change TActivity[]
  availableSMS: number;
  firstName: string;
  credits: number;
  createdAt: firebase.firestore.Timestamp;
  email: string;
  country: {
    code: string; // EX: CI
    dialCode: string; // EX: 225
  };
  moovUsage: number;
  mtnUsage: number;
  orangeUsage: number;
  internationalUsage: number;
  directUsage: number;
  scheduledUsage: number;
  broadcastUsage: number;
  adsUsage: number;
}

export type TSenderIDStatus = "PENDING" | "CANCELED" | "ACCEPTED";
export interface ISenderID {
  name: string;
  messageCount: number;
  status: TSenderIDStatus;
  id: string;
  message: string;
}
