import React from "react";
import { googleMapsApiKey } from "./Config.js";

import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

export const ReactGoogleMaps = compose(
  withProps({
    googleMapURL:
      `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `200px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={9}
    defaultCenter={{ lat: 41.0539991491, lng: 28.9707323677 }}
  >
    {props.markers}
  </GoogleMap>
));
