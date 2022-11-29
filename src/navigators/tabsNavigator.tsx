import * as React from 'react';

import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import {NewSermonsNavigator} from './newSermonsNavigator';
import {AllSermonsNavigator} from './allSermonsNavigator';
import {CollectionsNavigator} from './collectionsNavigator';
import {BibNavigator} from './bibNavigator';
import {InfoView} from '../components/views/InfoView';
import {Appearance} from '../appearance';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {ActionSheetIOS, Pressable, View} from 'react-native';
import {MiniPlayer} from '../components/views/MiniPlayer';
import {strings} from '../strings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import {useStores} from '../hooks/useStores';

const Tab = createBottomTabNavigator();

export const TabsNavigatior = () => {
  const {storageStore} = useStores();

  const clearHistory = async () => {
    if ((await storageStore.deleteSermonsHistory()) === true) {
      Toast.showWithGravity(strings.historyDeleted, 2, Toast.BOTTOM);
    } else {
      Toast.showWithGravity(strings.error, 2, Toast.BOTTOM);
    }
  };

  const clearDownloads = async () => {
    if ((await storageStore.deleteAllSermons()) === true) {
      Toast.showWithGravity(strings.downloadsDeleted, 2, Toast.BOTTOM);
    } else {
      Toast.showWithGravity(strings.error, 2, Toast.BOTTOM);
    }
  };

  const clearFavorites = async () => {
    if ((await storageStore.removeAllFavorisedSermons()) === true) {
      Toast.showWithGravity(strings.favoritesDeleted, 2, Toast.BOTTOM);
    } else {
      Toast.showWithGravity(strings.error, 2, Toast.BOTTOM);
    }
  };

  const onContextMenu = () => {
    const options = {
      options: [
        strings.cancel,
        strings.deleteHistory,
        strings.deleteDownloads,
        strings.deleteFavorites,
      ],
      cancelButtonIndex: 0,
    };
    const actionSheetCallback = (buttonIndex: number | undefined) => {
      switch (buttonIndex) {
        case 0:
          return;
        case 1:
          clearHistory();
          break;
        case 2:
          clearDownloads();
          break;
        case 3:
          clearFavorites();
          break;
      }
    };

    ActionSheetIOS.showActionSheetWithOptions(options, actionSheetCallback);
  };

  return (
    <Tab.Navigator
      tabBar={props => (
        <View>
          <MiniPlayer />
          <BottomTabBar {...props} />
        </View>
      )}>
      <Tab.Screen
        name="TabNewSermons"
        component={NewSermonsNavigator}
        options={() => ({
          tabBarIcon: ({focused}) => (
            <MaterialIcon
              name="new-releases"
              size={27}
              color={focused ? Appearance.baseColor : Appearance.greyColor}
            />
          ),
          tabBarLabel: strings.new,
          headerShown: false,
          tabBarActiveTintColor: Appearance.baseColor,
        })}
      />
      <Tab.Screen
        name="TabAllSermons"
        component={AllSermonsNavigator}
        options={() => ({
          tabBarIcon: ({focused}) => (
            <MaterialIcon
              name="local-library"
              size={27}
              color={focused ? Appearance.baseColor : Appearance.greyColor}
            />
          ),
          tabBarLabel: strings.all,
          headerShown: false,
          tabBarActiveTintColor: Appearance.baseColor,
        })}
      />
      <Tab.Screen
        name="TabCollections"
        component={CollectionsNavigator}
        options={() => ({
          tabBarIcon: ({focused}) => (
            <MaterialIcon
              name="collections-bookmark"
              size={27}
              color={focused ? Appearance.baseColor : Appearance.greyColor}
            />
          ),
          tabBarLabel: strings.collections,
          headerShown: false,
          tabBarActiveTintColor: Appearance.baseColor,
        })}
      />
      <Tab.Screen
        name="TabBibliothek"
        component={BibNavigator}
        options={() => ({
          headerRight: () => (
            <Pressable
              style={{paddingRight: 15}}
              key="search-button"
              onPress={onContextMenu}>
              {({pressed}) => (
                <Ionicons
                  name="ellipsis-vertical-outline"
                  color={pressed ? Appearance.baseColor : Appearance.darkColor}
                  size={20}
                />
              )}
            </Pressable>
          ),
          tabBarIcon: ({focused}) => (
            <MaterialIcon
              name="folder-special"
              size={27}
              color={focused ? Appearance.baseColor : Appearance.greyColor}
            />
          ),
          headerTitle: strings.library,
          tabBarLabel: strings.library,
          tabBarActiveTintColor: Appearance.baseColor,
          headerTintColor: Appearance.darkColor,
        })}
      />
      <Tab.Screen
        name="TabInfo"
        component={InfoView}
        options={() => ({
          tabBarIcon: ({focused}) => (
            <MaterialIcon
              name="info"
              size={27}
              color={focused ? Appearance.baseColor : Appearance.greyColor}
            />
          ),
          tabBarLabel: strings.info,
          headerShown: false,
          tabBarActiveTintColor: Appearance.baseColor,
        })}
      />
    </Tab.Navigator>
  );
};
