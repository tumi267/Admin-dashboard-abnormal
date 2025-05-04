'use client';

import React, { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from "react";

// Define your data type
type DataType = {
  product: string;
  qty: number;
};

// Define the shape of the context
interface ContextProps {
  data: DataType[];
  setData: Dispatch<SetStateAction<DataType[]>>;
}

// Create the context with default values (non-functional placeholder)
const GlobalContext = createContext<ContextProps>({
  data: [],
  setData: () => {},
});

// Accept children in the provider props
interface ProviderProps {
  children: ReactNode;
}

export const GlobalContextProvider = ({ children }: ProviderProps) => {
  const [data, setData] = useState<DataType[]>([]);

  return (
    <GlobalContext.Provider value={{ data, setData }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Hook to use the global context
export const useGlobalContext = () => useContext(GlobalContext);