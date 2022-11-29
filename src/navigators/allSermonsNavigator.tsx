import * as React from 'react';
import {SermonsNavigator} from './sermonsNavigator';
import {AllSermonsView} from '../components/views/AllSermonsView';
import {strings} from '../strings';

export const AllSermonsNavigator = () => {
  return (
    <SermonsNavigator
      baseComponentName={strings.all}
      baseComponent={AllSermonsView}
    />
  );
};
