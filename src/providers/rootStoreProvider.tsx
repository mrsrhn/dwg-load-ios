import React, {createContext, ReactNode} from 'react';
import {RootStore} from '../stores/rootStore';

export let store = new RootStore();
export const StoreContext = createContext<RootStore | undefined>(undefined);
StoreContext.displayName = 'StoreContext';

export function RootStoreProvider({children}: {children: ReactNode}) {
  // only create root store once (store is a singleton)
  const root = store ? store : new RootStore();
  return <StoreContext.Provider value={root}>{children}</StoreContext.Provider>;
}
