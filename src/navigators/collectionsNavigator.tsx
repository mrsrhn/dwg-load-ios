import * as React from 'react';
import {SermonsNavigator} from './sermonsNavigator';
import {CollectionsView} from '../components/views/CollectionsView';
import {strings} from '../strings';

export const CollectionsNavigator = () => {
  return (
    <SermonsNavigator
      baseComponentName={strings.collections}
      baseComponent={CollectionsView}
    />
  );
};
