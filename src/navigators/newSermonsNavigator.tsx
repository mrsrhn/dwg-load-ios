import * as React from 'react';
import {SermonsNavigator} from './sermonsNavigator';
import {NewSermonsView} from '../components/views/NewSermonsView';
import {strings} from '../strings';

export const NewSermonsNavigator = () => {
  return (
    <SermonsNavigator
      baseComponentName={strings.new}
      baseComponent={NewSermonsView}
    />
  );
};
