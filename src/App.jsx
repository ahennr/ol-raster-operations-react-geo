import React, { Component } from 'react';
import 'ol/ol.css';
import 'antd/dist/antd.css';

import './App.css';

import OlSourceWMTS from 'ol/source/wmts';
import OlLayerTile from 'ol/layer/tile';
import OlFormatWMTSCapabilities from 'ol/format/wmtscapabilities';
import OlView from 'ol/view';
import OlMap from 'ol/map';

import Main from './component/Main/Main.jsx';

import {
  mappify,
  MapProvider
} from '@terrestris/react-geo';
const MfMain = mappify(Main);

/**
 * Create the OlMap (you could do some asynchronus stuff here).
 *
 * @return {Promise} Promise that resolves an OlMap.
 */
const mapPromise = new Promise(resolve => {
  const parser = new OlFormatWMTSCapabilities();
  fetch('/wmts_topplus_web_open/1.0.0/WMTSCapabilities.xml')
    .then(response => response.text())
    .then(text => {
      const result = parser.read(text);

      var wmtsOptions = OlSourceWMTS.optionsFromCapabilities(result, {
        layer: 'web',
        matrixSet: 'EPSG:3857'
      });
      wmtsOptions.urls[0] = wmtsOptions.urls[0].replace('http://sgx.geodatenzentrum.de', '');
      wmtsOptions.crossOrigin = true;
      wmtsOptions.attributions = ['&copy; Bundesamt für Kartographie und Geodäsie &lt;2018&gt;, Datenquellen: <a href="http://sgx.geodatenzentrum.de/web_public/Datenquellen_TopPlus_Open.pdf">hier</a>'];
      const topoPlusSource = new OlSourceWMTS(wmtsOptions);

      const topoPlusLayer = new OlLayerTile({
        name: 'TopPlus-Web-Open',
        source: topoPlusSource
      });

      const map = new OlMap({
        view: new OlView({
          center: [818408.2587110486, 6559787.955535503],
          projection: 'EPSG:3857',
          zoom: 9,
        }),
        layers: [topoPlusLayer]
      });
      resolve(map);
    });
});

/**
 *
 */
class App extends Component {
  /** */
  render() {
    return (
      <MapProvider map={mapPromise}>
        <MfMain />
      </MapProvider>
    );
  }
}

export default App;
