import axios from "axios";
import { API_BASE_URL } from "../config";

export interface SupplierData {
    id: number;
    name: string;
    address: string;
    email: string;
    contactno: string;
}

const api = axios.create({
    baseURL: API_BASE_URL+"/api/supplier",
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const supplierService = {
    getSuppliers: async () => await api.get<SupplierData[]>(""),
    getSupplier: async (id: number) => await api.get<SupplierData>(`/${id}`),
    createSupplier: async (supplier: SupplierData) => await api.post<SupplierData>("", supplier),
    updateSupplier: async (id: number, supplier: SupplierData) => await api.put<SupplierData>(`/${id}`, supplier),
    deleteSupplier: async (id: number) => await api.delete<SupplierData>(`/${id}`),

}
