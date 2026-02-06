export interface Donor {
  uid: string;
  name: string;
  bloodGroup: string;
  area: string;
  institution?: string;
  phone: string;
  email: string;
  lastDonationDate: string;
  isAvailable: boolean;
  role: 'admin' | 'donor';
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  date: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  likes: Record<string, boolean>; // uid: true
  comments: Record<string, Comment>;
}

export interface Comment {
  userName: string;
  text: string;
  timestamp: number;
}

export interface CommunityData {
  partners: Array<{ name: string; imageUrl: string }>;
}

export enum BloodGroup {
  APlus = "A+",
  AMinus = "A-",
  BPlus = "B+",
  BMinus = "B-",
  OPlus = "O+",
  OMinus = "O-",
  ABPlus = "AB+",
  ABMinus = "AB-",
}

export interface UserContextType {
  user: Donor | null;
  loading: boolean;
  isAdmin: boolean;
  setUser: (user: Donor | null) => void;
}