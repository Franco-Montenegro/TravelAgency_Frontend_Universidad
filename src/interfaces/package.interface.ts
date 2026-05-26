export type PackageStatus = 'AVAILABLE' | 'SOLD_OUT' | 'CANCELLED' | 'EXPIRED' | 'DELETED';

export interface TourPackage {
  id: number;
  destination: string;
  price: number;
  availableSlots: number;
  startDate: string; 
  endDate: string; 
  status: PackageStatus;
}

export interface TourPackageRequest {
  destination: string;
  price: number;
  availableSlots: number;
  startDate: string;
  endDate: string;
  status: PackageStatus;
}