import React, { Component } from 'react';
import 'ol/ol.css';
import 'antd/dist/antd.css';

import './App.css';

import { Icon } from 'antd';

import OlSourceWMTS from 'ol/source/wmts';
import OlLayerTile from 'ol/layer/tile';
import OlFormatWMTSCapabilities from 'ol/format/wmtscapabilities';
import OlView from 'ol/view';
import OlMap from 'ol/map';

import {
  MapComponent,
  MapProvider,
  NominatimSearch,
  mappify
} from '@terrestris/react-geo';


/**
 * Create the OlMap (you could do some asynchronus stuff here).
 *
 * @return {Promise} Promise that resolves an OlMap.
 */
const mapPromise = new Promise((resolve) => {

  const parser = new OlFormatWMTSCapabilities();
  fetch('https://sgx.geodatenzentrum.de/wmts_topplus_web_open/1.0.0/WMTSCapabilities.xml')
    .then(response => response.text())
    .then(text => {
        const result = parser.read(text);
        const wmtsOptions = OlSourceWMTS.optionsFromCapabilities(result, {
          layer: 'web',
          matrixSet: 'WEBMERCATOR'
        });
        const layer = new OlLayerTile({
          source: new OlSourceWMTS(wmtsOptions)
        })
        const map = new OlMap({
          view: new OlView({
            center: [818408.2587110486, 6559787.955535503],
            projection: 'EPSG:3857',
            zoom: 9,
          }),
          layers: [layer]
        });
        resolve(map);
      });
});

const Map = mappify(MapComponent);
const Search = mappify(NominatimSearch);

class App extends Component {
  render() {
    return (
      <MapProvider map={mapPromise}>
        <div className="search">
          <Icon type="search" className="searchIcon" />
          <Search />
        </div>
        <Map className="map" />
      </MapProvider>
    );
  }
}

export default App;
