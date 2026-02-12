export enum AuctionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  documents: {
    cpf: string;
    cnh?: string;
    address: string;
    hasSelfie: boolean;
    docUrl?: string;
    selfieUrl?: string;
  };
  joinedAt: Date;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  origin: string;
  itemCount: number;
  startingPrice: number;
  currentBid: number | null;
  endsAt: Date;
  status: AuctionStatus;
  bids: Bid[];
  imageUrls: string[];
  videoUrl?: string;
  lotCode: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderName: string;
  bidderId: string;
  amount: number;
  timestamp: Date;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
}

export interface CreateAuctionData {
  title: string;
  description: string;
  category: string;
  condition: string; 
  origin: string;
  itemCount: number;
  startingPrice: number;
  durationInHours: number;
  imageUrls: string[]; 
  videoUrl?: string; 
}

export interface AISuggestion {
  suggestedTitle: string;
  suggestedDescription: string;
  estimatedMarketPrice: number;
  category: string;
  itemCount: number;
  origin: string;
  condition: string;
}
