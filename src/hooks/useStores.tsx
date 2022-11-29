import {useContext} from 'react';
import {StoreContext} from '../providers/rootStoreProvider';

export function useStores() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useRootStore must be used within RootStoreProvider');
  }

  return context;
}
