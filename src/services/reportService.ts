import { api } from './api';
import type { ReportResponseDTO } from '../interfaces/report.interface';

export const reportService = {
  getDashboardStats: async (): Promise<ReportResponseDTO> => {
    const response = await api.get<ReportResponseDTO>('/reports/dashboard');
    return response.data;
  }
};