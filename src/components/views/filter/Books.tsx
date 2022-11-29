import * as React from 'react';
import {FlatList, View, TouchableHighlight, StyleSheet} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {observer} from 'mobx-react-lite';
import {useStores} from '../../../hooks/useStores';

export const Books = observer(() => {
  const {userSessionStore} = useStores();
  const selectedBook = userSessionStore.filteredBook;
  return (
    <FlatList
      data={userSessionStore.books}
      renderItem={({item}) => (
        <TouchableHighlight underlayColor="white">
          <View style={styles.button}>
            <BouncyCheckbox
              size={25}
              fillColor="#8FC664"
              unfillColor="#FFFFFF"
              text={`${item.long}`}
              iconStyle={{borderColor: '#8FC664'}}
              textStyle={{
                textDecorationLine: 'none',
              }}
              disableBuiltInState={true}
              isChecked={selectedBook?.id === item.id}
              onPress={() => {
                const isChecked = selectedBook?.id === item.id;
                if (isChecked) {
                  userSessionStore.updateFilteredBook(undefined);
                } else {
                  userSessionStore.updateFilteredBook(item);
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
