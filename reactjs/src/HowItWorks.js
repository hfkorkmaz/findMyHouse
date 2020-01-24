import React, { Component } from "react";
import howItWorks from "./style/img/howItWorks.png";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
export default class HowItWorks extends Component {
  render() {
    return (
      <div>
        <img
          src={howItWorks}
          style={{ width: "55%", height: "50%", padding: "10px", marginTop:'30px' }}
        />
        <div>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/"
            style={{ marginTop: "20px" }}
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }
}
