import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import PeopleIcon from "@material-ui/icons/People";
import BuildIcon from "@material-ui/icons/Build";
import Fab from "@material-ui/core/Fab";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    }
  }
}));

export default function LandingPage() {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.root}>
        <div style={{ marginTop: "10%" }}>
          <h1>Welcome to FindMyHouse Application!</h1>
          <h2>What are you looking for?</h2>
        </div>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/rent/filter"
        >
          House for Rent
        </Button>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/sale/filter"
        >
          House for Sale
        </Button>

        <div>
          <Fab
            variant="extended"
            size="small"
            color="primary"
            aria-label="add"
            className={classes.margin}
            style={{ marginRight: "10px", backgroundColor: "#eeeeee1c" }}
            component={Link}
            to="/aboutUs"
          >
            <PeopleIcon className={classes.extendedIcon} />
            &nbsp;About Us
          </Fab>
          <Fab
            variant="extended"
            size="small"
            color="primary"
            aria-label="add"
            className={classes.margin}
            style={{ marginRight: "10px", backgroundColor: "#eeeeee1c" }}
            component={Link}
            to='/howItWorks'
          >
            <BuildIcon className={classes.extendedIcon} />
            &nbsp;How It Works
          </Fab>
        </div>
      </div>
    </div>
  );
}
