import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  find,
  isBusy,
  shouldRefresh,
  getCollection
} from '@shoutem/redux-io';
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
  mapDispatchToProps,
} from './ProductsList';

import { getProducts } from '../redux/selectors';

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

  componentDidMount() {
    const { error } = this.props.shop;

    if (error) {
      return;
    }

    const { find, shopifyAttachments } = this.props;

    find(ext('Shopify'), 'all', {
        include: 'featuredImage',
    })

    super.refreshData();
  }

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
    let featuredImage = this.props.shopifyAttachments.slice(-1)[0],
        featuredImageSrc = featuredImage.featuredImage.url;

    return (
      <View>
        <Image
          styleName="large-wide"
          source={{uri: featuredImageSrc || ''}}
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

const mapStateToProps = (state, ownProps) => {
  const { shop } = state[ext()];
  const { collectionId, tag } = ownProps;

  const productsState = getProducts(state, collectionId, tag);

  const shopifyAttachments = getCollection(state[ext()].allShopifyAttachments, state);

  return {
    collectionId,
    productsState,
    shop,
    shopifyAttachments,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ProductsGridWithFeaturedImage'), {})(ProductsGridWithFeaturedImage),
);
