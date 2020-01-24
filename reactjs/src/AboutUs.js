import React, { Component } from "react";
import babyyoda from "./style/img/babyyoda.jfif";
import reyhan from "./style/img/reyhan.jfif";
import ahmet from "./style/img/ahmet.jfif";
import sevval from "./style/img/sevval.jfif";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

export default class AboutUs extends Component {
  render() {
    return (
      <div style={{ marginTop: "50px" }}>
        <h1>About Us!</h1>

        <p>
          Tired of changing your home and not being able to find a suitable
          location for yourself? <br /> We know, and we understand! Because we
          do too!
        </p>
        <p>
          We are a team that has come together to create new generation real
          estate technologies to make your experience better for a couple of
          <br />
          friends or your families who are looking for a house in a suitable
          location to move into.
        </p>
        <p>
          We are here to help you find the best location for your new house,
          listening to your needs!
        </p>
        <div>
          <div style={{ display: "inline-block" }}>
            <img
              src={babyyoda}
              style={{ width: "250px", height: "250px", padding: "10px" }}
            />
            <div>Hakkı Furkan Korkmaz</div>
          </div>
          <div style={{ display: "inline-block" }}>
            <img
              src={reyhan}
              style={{ width: "250px", height: "250px", padding: "10px" }}
            ></img>
            <div>Reyhan Tosun</div>
          </div>
          <div style={{ display: "inline-block" }}>
            <img
              src={ahmet}
              style={{ width: "250px", height: "250px", padding: "10px" }}
            ></img>
            <div>Ahmet Sait Küçük</div>
          </div>
          <div style={{ display: "inline-block" }}>
            <img
              src={sevval}
              style={{ width: "250px", height: "250px", padding: "10px" }}
            ></img>
            <div>Şevval Genç</div>
          </div>
        </div>
        <div>
          <Button variant="contained" color="secondary" component={Link} to="/" style={{marginTop:"20px"}}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }
}
