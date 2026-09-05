"use client";

import React, { createContext, useContext, useState } from 'react';

export type Page = 'studio' | 'materials' | 'pricing';

interface NavContextType {
  page: Page;
  setPage: (p: Page) => void;
  showSignIn: boolean;
  setShowSignIn: (show: boolean) => void;
}

const NavContext = createContext<NavContextType>({
  page: 'studio',
  setPage: () => {},
  showSignIn: false,
  setShowSignIn: () => {},
});

export const useNav = () => useContext(NavContext);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<Page>('studio');
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <NavContext.Provider value={{ page, setPage, showSignIn, setShowSignIn }}>
      {children}
    </NavContext.Provider>
  );
}
