import * as React from 'react';
import {FlatList, View, TouchableHighlight, StyleSheet} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {observer} from 'mobx-react-lite';
import {useStores} from '../../../hooks/useStores';

export const Artists = observer(() => {
  const {userSessionStore} = useStores();
  const selectedArtist = userSessionStore.filteredArtist;
  return (
    <FlatList
      data={userSessionStore.artists}
      renderItem={({item}) => (
        <TouchableHighlight underlayColor="white">
          <View style={styles.button}>
            <BouncyCheckbox
              size={25}
              fillColor="#8FC664"
              unfillColor="#FFFFFF"
              text={`${item.name}`}
              iconStyle={{borderColor: '#8FC664'}}
              textStyle={{
                textDecorationLine: 'none',
              }}
              disableBuiltInState={true}
              isChecked={selectedArtist?.id === item.id}
              onPress={() => {
                const isChecked = selectedArtist?.id === item.id;
                if (isChecked) {
                  userSessionStore.updateFilteredArtist(undefined);
                } else {
                  userSessionStore.updateFilteredArtist(item);
                }
              }}
            />
          </View>
        </TouchableHighlight>
      )}
    />
  );
});

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});
