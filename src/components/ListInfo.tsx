import * as React from 'react';
import {View, Text} from 'react-native';
import {Appearance} from '../appearance';

interface ListInfoProps {
  info: string;
}
export const ListInfo: React.FC<ListInfoProps> = props => (
  <View style={{display: 'flex', alignItems: 'center', padding: 30}}>
    <Text
      style={{fontSize: 22, color: Appearance.greyColor, fontWeight: 'bold'}}>
      {props.info}
    </Text>
  </View>
);
