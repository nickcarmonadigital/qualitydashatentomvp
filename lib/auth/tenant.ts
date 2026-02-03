import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TenantState {
    tenantId: string;
    setTenantId: (id: string) => void;
}

// Simple Client-Side Tenant Context using Zustand
export const useTenant = create<TenantState>()(
    persist(
        (set) => ({
            tenantId: 'default-tenant', // Default for MVP
            setTenantId: (id) => set({ tenantId: id }),
        }),
        {
            name: 'tenant-storage',
        }
    )
);
