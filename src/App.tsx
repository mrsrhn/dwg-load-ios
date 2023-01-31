import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {RootStoreProvider} from './providers/rootStoreProvider';
import {SoundComponent} from './components/sound';
import {SearchView} from './components/views/SearchView';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TabsNavigatior} from './navigators/tabsNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PlayerView} from './components/views/PlayerView';
import {navigationRef} from './RootNavigation';
import {Appearance} from './appearance';
import {StatusBar} from 'react-native';
import {strings} from './strings';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <RootStoreProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator>
            <Stack.Screen
              name="Tabs"
              component={TabsNavigatior}
              options={() => ({headerShown: false})}
            />
            <Stack.Screen
              name="Search"
              component={SearchView}
              options={() => ({
                headerTintColor: Appearance.darkColor,
                headerBackTitle: strings.back,
                headerTitle: strings.search,
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <PlayerView />
      </RootStoreProvider>
    </SafeAreaProvider>
  );
}
