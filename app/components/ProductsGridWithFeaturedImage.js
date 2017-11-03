import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Divider,
  Heading,
  GridRow,
  Icon,
  Image,
  Overlay,
  Subtitle,
  Text,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import {
  ProductsList,
  mapStateToProps,
  mapDispatchToProps,
} from './ProductsList';

import GridItemTall from '../components/GridItemTall';
import FeaturedItem from '../components/FeaturedItem';

import { ext } from '../const';

/**
 * A component that displays products in a grid, with the first one featured.
 */
class ProductsGridWithFeaturedImage extends ProductsList {
  static propTypes = {
    ...ProductsList.propTypes,
  };

  renderProductRow(products, sectionId, index) {
    if (index === '0' && this.props.showFeaturedImage) {
      return this.renderFeaturedImage();
    }

    const gridProducts = _.map(products, product => this.renderGridProduct(product));

    return (
      <GridRow columns={2}>
        {gridProducts}
      </GridRow>
    );
  }

  renderGridProduct(item) {
    const { shop } = this.props;

    return (
      <GridItemTall
        item={item}
        key={item.product_id}
        onAddToCart={() => this.onAddToCart(item)}
        onPress={() => this.navigateToProductDetails(item)}
        shop={shop}
      />
    );
  }

  renderFeaturedImage() {
    return (
      <View>
        <Image
          styleName="large-wide"
          source={{uri: 'https://placehold.it/600x400?text=Featured%20Image'}}
          defaultSource={require('../assets/images/image-fallback.png')}
        ></Image>
      </View>
    );
  }

  renderProducts(products, isLoading) {
    // Group the products into rows with 2 columns
    const groupedProducts = GridRow.groupByRows(products, 2);

    return super.renderProducts(groupedProducts, isLoading);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ProductsGridWithFeaturedImage'), {})(ProductsGridWithFeaturedImage),
);
