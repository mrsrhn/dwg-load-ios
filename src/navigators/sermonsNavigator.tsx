import React from 'react';
import {observer} from 'mobx-react-lite';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AlbumTitlesList} from '../components/lists/albumTitlesList';
import {CollectionTitlesList} from '../components/lists/collectionTitlesList';
import {Pressable, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Appearance} from '../appearance';
import {useSortActions} from '../hooks/useSortActions';
import {strings} from '../strings';
import {useStores} from '../hooks/useStores';
import {FilterView} from '../components/views/filter/FilterView';

interface SermonsNavigatorProps {
  baseComponentName: string;
  baseComponent: React.FC;
  showHeader?: boolean;
}
const Stack = createNativeStackNavigator();
export const SermonsNavigator = observer((props: SermonsNavigatorProps) => {
  const {baseComponentName, baseComponent} = props;

  const {userSessionStore} = useStores();

  const {openSortActions, selectedOption} = useSortActions();

  const defaultViewOptions = (navigation: any) => ({
    headerRight: () =>
      baseComponentName === strings.all ? (
        <Pressable
          style={{paddingRight: 15}}
          key="search-button"
          onPress={() => navigation.navigate('Search')}>
          {({pressed}) => (
            <Ionicons
              name="search-outline"
              color={pressed ? Appearance.baseColor : Appearance.darkColor}
              size={20}
            />
          )}
        </Pressable>
      ) : baseComponentName === strings.collections ? (
        <Pressable
          style={{paddingRight: 15}}
          key="info-button"
          onPress={() => userSessionStore.setInfoCollectionModalVisible(true)}>
          {({pressed}) => (
            <Ionicons
              name="information-circle-outline"
              color={pressed ? Appearance.baseColor : Appearance.darkColor}
              size={20}
            />
          )}
        </Pressable>
      ) : null,
    headerShown: props.showHeader === undefined ? true : props.showHeader,
    headerTintColor: Appearance.darkColor,
    headerLeft: () =>
      baseComponentName === strings.all
        ? [
            <Pressable
              style={{
                padding: 15,
              }}
              key="filter-button"
              onPress={() => navigation.navigate('FilterView')}>
              {({pressed}) => (
                <Ionicons
                  name="ios-filter"
                  size={20}
                  color={pressed ? Appearance.baseColor : Appearance.darkColor}
                />
              )}
            </Pressable>,
            <Pressable
              style={{
                padding: 15,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              key="sort-button"
              onPress={openSortActions}>
              {({pressed}) => (
                <>
                  <Ionicons
                    name="swap-vertical"
                    size={20}
                    color={
                      pressed ? Appearance.baseColor : Appearance.darkColor
                    }
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      color: Appearance.greyColor,
                      fontSize: 11,
                    }}>
                    {selectedOption.shortName}
                  </Text>
                </>
              )}
            </Pressable>,
          ]
        : null,
  });

  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name={baseComponentName}
          component={baseComponent}
          options={({navigation}) => defaultViewOptions(navigation)}
        />
        <Stack.Screen
          name="AlbumList"
          component={AlbumTitlesList}
          options={({route}) => ({
            headerBackTitle: 'Zurück',
            title: route?.params?.name,
            headerTintColor: Appearance.darkColor,
          })}
        />
        <Stack.Screen
          name="CollectionList"
          component={CollectionTitlesList}
          options={({route}) => ({
            headerBackTitle: 'Zurück',
            title: route?.params?.name,
            headerTintColor: Appearance.darkColor,
          })}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerStyle: {backgroundColor: 'transparent'},
          headerTitle: '',
          contentStyle: {backgroundColor: 'transparent'},
        }}>
        <Stack.Screen name="FilterView" component={FilterView} />
      </Stack.Group>
    </Stack.Navigator>
  );
});
