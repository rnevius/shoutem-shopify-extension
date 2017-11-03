import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import {
  appId,
  url,
} from 'environment';
console.log(appId);
console.log(url);
import { LoaderContainer } from '@shoutem/react-web-ui';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import { ImageUploader, S3Uploader } from '@shoutem/web-core';
import { connect } from 'react-redux';
import './style.scss';

class ProductsGridWithFeaturedImageSettings extends Component {
  static propTypes = {
    shortcut: PropTypes.object,
    updateShortcutSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      error: null,
      greeting: _.get(props.shortcut, 'settings.greeting'),
      // flag indicating if value in input field is changed
      hasChanges: false,
    };

    this.uploader = new S3Uploader({
      appId,
      basePolicyServerPath: url.apps,
      folderName: 'images',
    });
  }

  componentWillReceiveProps(nextProps) {
    const { shortcut: nextShortcut } = nextProps;
    const { greeting } = this.state;

    if (_.isEmpty(greeting)) {
      this.setState({
        greeting: _.get(nextShortcut, 'settings.greeting'),
      });
    }
  }

  handleTextChange(event) {
    this.setState({
      greeting: event.target.value,
      hasChanges: true,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { shortcut } = this.props;
    const { greeting } = this.state;

    this.setState({ error: '', inProgress: true });
    this.props.updateShortcutSettings(shortcut, { greeting })
      .then(() => (
        this.setState({ hasChanges: false, inProgress: false })
      )).catch((err) => {
      this.setState({ error: err, inProgress: false });
    });
  }

  render() {
    const { error, hasChanges, inProgress, greeting } = this.state;
    const { featuredImage, } = this.props;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <h3>Settings</h3>
            <ControlLabel>Featured Image:</ControlLabel>
            <ImageUploader
              previewSize="custom"
              onUploadSuccess={handleFeaturedImageUpload}
              preview={featuredImage}
              icon="add-photo"
              uploader={this.uploader}
              onDeleteSuccess={handleFeaturedImageDelete}
            />
          </FormGroup>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcutSettings: (shortcut, settings) => (
      dispatch(updateShortcutSettings(shortcut, settings))
    ),
  };
}

export default connect(null, mapDispatchToProps)(ProductsGridWithFeaturedImageSettings);
