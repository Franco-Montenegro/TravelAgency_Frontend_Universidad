export type PackageStatus = 'AVAILABLE' | 'SOLD_OUT' | 'CANCELLED' | 'EXPIRED' | 'DELETED';

export interface TourPackage {
  id: number;
  name: string;
  destination: string;
  description: string;
  price: number;
  totalSlots: number;
  startDate: string; 
  endDate: string; 
  status: PackageStatus;
}

export interface TourPackageRequest {
  name: string;
  destination: string;
  description: string;
  price: number;
  totalSlots: number;
  startDate: string;
  endDate: string;
  status: PackageStatus;
}