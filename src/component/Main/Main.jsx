import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Layout,
  Icon,
  Radio
} from 'antd';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import OlMap from 'ol/map';
import OlRasterSource from 'ol/source/raster';
import OlImageLayer from 'ol/layer/image';
import OlLayerGroup from 'ol/layer/group';

import RasterOperations from '../../util/RasterOperations.js';

import {
  LayerTree,
  NominatimSearch,
  MapComponent,
  mappify
} from '@terrestris/react-geo';

const { Content } = Layout;

const Map = mappify(MapComponent);
const Search = mappify(NominatimSearch);
const MappifiedLt = mappify(LayerTree);

/**
* Class representating the main component.
*
* @class The Main.
* @extends React.Component
*/
class Main extends Component {

  _transformedLayerName = 'Transformed layer with image raster - operation';
  _transformedLayerNamePixel = 'Transformed layer with pixel raster - operation';
  _transformedLayerImage = null;
  _transformedLayerPixel = null;
  _rasterOperationLib = {
    convolve: RasterOperations.convolve
  }

  static propTypes = {
    /**
     * ol map instance bound to thie component.
     * @type {OlMap}
     */
    map: PropTypes.instanceOf(OlMap),
  }

  /**
   * The constructor.
   *
   * @constructs Main
   * @param {Object} props The properties.
   */
  constructor(props) {
    super(props);
    this.state = {
      selectedTransform: RasterOperations.emboss,
      // operationType: 'pixel'
      operationType: 'image'
    };
  }

  /**
   *
   */
  componentWillMount (){
    const {
      selectedTransform,
      operationType
    } = this.state;

    const { map } = this.props;
    const layerGroup = map.getLayerGroup();
    const layer = layerGroup.getLayers().getArray()[0];
    const topoPlusSource = layer.getSource();

    const raster = new OlRasterSource({
      sources: [topoPlusSource],
      crossOrigin: 'anonymous',
      operation: selectedTransform,
      operationType: operationType,
      lib: this._rasterOperationLib
    });

    this._transformedLayer = new OlImageLayer({
      name: this._transformedLayerName,
      source: raster
    });

    this._layerGroup = new OlLayerGroup({
      layers: [layer, this._transformedLayer]
    });

    map.setLayerGroup(this._layerGroup);
  }

  updateMapView = () => {
    const {
      operationType,
      selectedTransform
    } = this.state;
    
    const rasterSource = this._transformedLayer.getSource();
    rasterSource.setOperation(selectedTransform, this._rasterOperationLib);
    rasterSource.set('operationType', operationType);
  }

  onChange = e => {
    const value = e.target.value;
    let operationType = 'image';
    let selectedTransform;
    if (value === 'invertColor') {
      operationType = 'pixel';
    }
    switch (value) {
      case 'invertColor':
        selectedTransform = RasterOperations.invertColor;
        break;
      case 'edge':
        selectedTransform = RasterOperations.edge;
        break;
      case 'emboss':
        selectedTransform = RasterOperations.emboss;
        break;
      case 'sharpen':
        selectedTransform = RasterOperations.sharpen;
        break;
      case 'sobelHoriz':
        selectedTransform = RasterOperations.sobelHoriz;
        break;
      case 'sobelVert':
        selectedTransform = RasterOperations.sobelVert;
        break;
      case 'canny':
        selectedTransform = RasterOperations.canny;
        break;
      case 'gaussianBlur':
        selectedTransform = RasterOperations.gaussianBlur;
        break;
      case 'log':
        selectedTransform = RasterOperations.log;
        break;
      default:
        break;
    }
    this.setState({
      operationType,
      selectedTransform
    }, this.updateMapView);
  }

  /**
   * The render function.
   */
  render() {
    return (
      <Layout className="main-layout" id="main">
        <Content className="center-content">
          <div className="search">
            <Icon type="search" className="searchIcon" />
            <Search />
          </div>
          <MappifiedLt layerGroup={this._layerGroup}/>
          <Map className="map" />
          <RadioGroup onChange={this.onChange} defaultValue="emboss">
            {/* <RadioButton value="invertColor">invertColor</RadioButton> */}
            {/* <RadioButton value="edge">edge</RadioButton> */}
            <RadioButton value="emboss">emboss</RadioButton>
            <RadioButton value="sharpen">sharpen</RadioButton>
            <RadioButton value="sobelHoriz">sobelHoriz</RadioButton>
            <RadioButton value="sobelVert">sobelVert</RadioButton>
            <RadioButton value="canny">canny</RadioButton>
            {/* <RadioButton value="gaussianBlur">gaussianBlur</RadioButton> */}
            <RadioButton value="log">Laplacian of Gaussian</RadioButton>
          </RadioGroup>
        </Content>
      </Layout>
    );
  }
}

export default Main;
