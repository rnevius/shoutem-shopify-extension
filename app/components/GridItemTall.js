import React from 'react';
import { Dimensions } from 'react-native';
const window = Dimensions.get('window');

import {
  Button,
  Caption,
  Card,
  Icon,
  Image,
  Subtitle,
  Tile,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';

import ListItem from './ListItem';

const GridItemTall = ({ item, onAddToCart, onPress, shop }) => {
  const { images, minimum_price, minimum_compare_at_price, title } = item;
  const { currency = '' } = shop;
  const styles = {
    gridItem: {
      flex: 1, 
      flexWrap: 'wrap', 
      padding: 10
    },
    productImage: {
      height: window.width * 0.75,
      width: window.width / 2
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.gridItem}>
      <Tile styleName="clear">
        <Image
          source={{ uri: (images[0] || {}).src }}
          defaultSource={require('../assets/images/image-fallback.png')}
          style={styles.productImage}
        />
        <View styleName="content">
          <Subtitle numberOfLines={3}>{title.toLowerCase()}</Subtitle>
          <View styleName="horizontal v-center space-between">
            <Subtitle
              styleName="md-gutter-right bold"
            >
              {`${minimum_price} ${currency}`}
            </Subtitle>
            <Caption styleName="line-through">
              {minimum_compare_at_price ? `${minimum_compare_at_price} ${currency}` : ''}
            </Caption>
          </View>
        </View>
      </Tile>
    </TouchableOpacity>
  );
};

GridItemTall.propTypes = {
  ...ListItem.propTypes,
};

export default connectStyle(ext('GridItemTall'))(GridItemTall);
