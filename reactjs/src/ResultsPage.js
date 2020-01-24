import React, { Component } from "react";
import CustomizedTables from "./ResultTable";
import { ReactGoogleMaps } from "./MapWithMarkers";
import { Marker } from "react-google-maps";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";


class ResultsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedHouse: [],
      showSelectedHouses: false
    };
  }

  createData = (
    ahpScore,
    netm2,
    numberOfRooms,
    ageOfBuilding,
    sosyoekonomikScore,
    price,
    mahalle,
    ilce,
    lat,
    lng,
    link,
    İlanno
  ) => {
    return {
      ahpScore,
      netm2,
      numberOfRooms,
      ageOfBuilding,
      sosyoekonomikScore,
      price,
      mahalle,
      ilce,
      lat,
      lng,
      link,
      İlanno
    };
  };

  handleMapIconClick = row => {
    this.setState({
      selectedHouse: [
        ...this.state.selectedHouse,
        { id: `${row.İlanno}`, lat: row.lat, lng: row.lng }
      ],
      showSelectedHouses: true
    });
  };

  clearSelectedHouses = () => {
    console.log("clearSelectedHouses a girdi");
    this.setState({ selectedHouse: [], showSelectedHouses: false });
  };

  render() {
    const rows = [];
    let markers = [];

    this.props.results.forEach(result => {
      rows.push(
        this.createData(
          result.ahpScore,
          result.Netm2,
          result.OdaSayısı,
          result.BinaYaşı,
          result.Sosyoekonomik,
          result.Price,
          result.Location1,
          result.ilce,
          result.Latitude,
          result.Longitude,
          result.link,
          result.İlanno
        )
      );

      markers.push(
        <Marker
          position={{ lat: result.Latitude, lng: result.Longitude }}
          key={`${result.İlanno}`}
        />
      );
    });

    const tableHeads = [
      "AHP Score, Net m2",
      "Number of Rooms",
      "Age of the Building",
      "Socioeconomic Status",
      "Price"
    ];

    if (typeof this.props.results[0] === "undefined") {
      return (
        <div>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/"
            style={{ marginTop: "10%" }}
          >
            Go Home
          </Button>
        </div>
      );
    } else if (this.state.showSelectedHouses === true) {
      let selectedHousesMarkers = [];

      selectedHousesMarkers.push(
        <Marker
          position={{
            lat: this.state.selectedHouse[0].lat,
            lng: this.state.selectedHouse[0].lng
          }}
          key={this.state.selectedHouse[0].id}
        />
      );

      return (
        <div style={{ display: "inline-block", marginTop: "20px" }}>
          <ReactGoogleMaps markers={selectedHousesMarkers} />

          <CustomizedTables
            rows={rows}
            tableHeads={tableHeads}
            handleMapIconClick={this.handleMapIconClick}
            clearSelectedHouses={this.clearSelectedHouses}
          />
        </div>
      );
    } else {
      return (
        <div style={{ display: "inline-block", marginTop: "20px" }}>
          <ReactGoogleMaps markers={markers} />

          <CustomizedTables
            rows={rows}
            tableHeads={tableHeads}
            handleMapIconClick={this.handleMapIconClick}
            clearSelectedHouses={this.clearSelectedHouses}
          />
        </div>
      );
    }
  }
}
export default ResultsPage;
