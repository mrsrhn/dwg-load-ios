import * as React from 'react';
import {SermonsNavigator} from './sermonsNavigator';
import {DownloadsView} from '../components/views/DownloadsView';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {FavoritesView} from '../components/views/FavoritesView';
import {HistoryView} from '../components/views/HistoryView';
import {Appearance} from '../appearance';
import {strings} from '../strings';

const Tab = createMaterialTopTabNavigator();

const Downloads = () => (
  <SermonsNavigator
    baseComponentName="TabDownloads"
    baseComponent={DownloadsView}
    showHeader={false}
  />
);

const Favorites = () => (
  <SermonsNavigator
    baseComponentName="TabFavorites"
    baseComponent={FavoritesView}
    showHeader={false}
  />
);

const History = () => (
  <SermonsNavigator
    baseComponentName="TabHistory"
    baseComponent={HistoryView}
    showHeader={false}
  />
);

export const BibNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarPressColor: Appearance.darkColor,
        tabBarActiveTintColor: Appearance.darkColor,
        tabBarIndicatorStyle: {backgroundColor: Appearance.darkColor},
      }}>
      <Tab.Screen name={strings.favorised} component={Favorites} />
      <Tab.Screen name={strings.downloads} component={Downloads} />
      <Tab.Screen name={strings.history} component={History} />
    </Tab.Navigator>
  );
};
