import convert from 'xml-js';
import { map, path, compose } from 'ramda';
import baseRepo from './_base';

const featureDetailsRepo = {

  getReport(uid) {
    return baseRepo({
        method: 'get',
        params: {
          request: 'execute',
          service: 'WPS',
          identifier: 'borehole_data',
          version: '1.0.0',
          datainputs: `input_id=${ uid }`
        }
    })
    .then(({ data }) => convert.xml2js(data, { compact: true, spaces: 2}))
    .then(data => formatDataIntoLinks(data))
    ;
  }

};

function formatDataIntoLinks(data) {
  // 🐏
  const formatLink = feature => {
    const id = path(['ows:Identifier', '_text'], feature);
    const url = path(['wps:Data', 'wps:ComplexData', '_cdata'], feature);
    return {
      id,
      name: id.replace('_', ' '),
      url
    };
  };

  const buildLinks = compose(
    map(formatLink),
    path(['wps:ExecuteResponse', 'wps:ProcessOutputs', 'wps:Output'])
  );

  return buildLinks(data);
}

export default featureDetailsRepo;