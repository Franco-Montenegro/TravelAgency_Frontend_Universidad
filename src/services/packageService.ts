import { api } from './api';
import type { TourPackage, TourPackageRequest } from '../interfaces/package.interface';

export const packageService = {
  getAllPackages: async (): Promise<TourPackage[]> => {
    const response = await api.get<TourPackage[]>('/packages/');
    return response.data;
  },

  createPackage: async (pkgData: TourPackageRequest): Promise<TourPackage> => {
    const response = await api.post<TourPackage>('/packages/', pkgData);
    return response.data;
  },

  updatePackage: async (id: number, pkgData: TourPackageRequest): Promise<TourPackage> => {
    const response = await api.put<TourPackage>(`/packages/${id}`, pkgData);
    return response.data;
  },

  deletePackageLogical: async (id: number): Promise<void> => {
    await api.delete(`/packages/${id}`);
  }
};