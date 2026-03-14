import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PortfolioStore {
  currency: "USD" | "INR";
  setCurrency: (currency: "USD" | "INR") => void;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      currency: "USD",
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "foxfolio-preferences",
    }
  )
);
