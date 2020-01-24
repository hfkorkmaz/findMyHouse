import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles(theme => ({
  root: {
    width: 300
  },
  margin: {
    height: theme.spacing(3)
  }
}));

const marks = [
  {
    value: -8,
    label: "8"
  },
  {
    value: -7,
    label: "7"
  },
  {
    value: -6,
    label: "6"
  },
  {
    value: -5,
    label: "5"
  },
  {
    value: -4,
    label: "4"
  },
  {
    value: -3,
    label: "3"
  },
  {
    value: -2,
    label: "2"
  },
  {
    value: -1,
    label: "1"
  },
  {
    value: 0,
    label: "0"
  },
  {
    value: 1,
    label: "1"
  },
  {
    value: 2,
    label: "2"
  },
  {
    value: 3,
    label: "3"
  },
  {
    value: 4,
    label: "4"
  },
  {
    value: 5,
    label: "5"
  },
  {
    value: 6,
    label: "6"
  },
  {
    value: 7,
    label: "7"
  },
  {
    value: 8,
    label: "8"
  }
];

function valuetext(value) {
  return `${value}°C`;
}

export default function DiscreteSlider(props) {
  const classes = useStyles();

  const handleChange = (tabId, newValue, sliderName) => {
    props.handleSliderChange(tabId, newValue, sliderName);
  };

  return (
    <div className="grid-container">
      <div className="grid-item">
        <div style={{ marginTop: "30px" }}>Economic</div>
      </div>
      <div className="grid-item">
        <div className={classes.root}>
          <Typography id="discrete-slider" gutterBottom>
            Which is one more important to you?
          </Typography>
          <Slider
            onChange={(event, value) =>
              handleChange(props.index, value, "economicEnvironment")
            }
            value={props.value.economicEnvironment}
            track={false}
            defaultValue={0}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider"
            step={1}
            marks={marks}
            min={-8}
            max={8}
          />
        </div>
      </div>
      <div className="grid-item">
        <div style={{ marginTop: "30px" }}>Environment</div>
      </div>
      <div className="grid-item">
        <div>Economic</div>
      </div>
      <div className="grid-item">
        <div className={classes.root}>
          <Slider
            onChange={(event, value) =>
              handleChange(props.index, value, "economicBuilding")
            }
            value={props.value.economicBuilding}
            track={false}
            defaultValue={0}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider"
            step={1}
            marks={marks}
            min={-8}
            max={8}
          />
        </div>
      </div>
      <div className="grid-item">
        <div>Building {<br />} Characteristics</div>
      </div>
      <div className="grid-item">
        <div>Environment</div>
      </div>
      <div className="grid-item">
        <div className={classes.root}>
          <Slider
            onChange={(event, value) =>
              handleChange(props.index, value, "environmentBuilding")
            }
            value={props.value.environmentBuilding}
            track={false}
            defaultValue={0}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider"
            step={1}
            marks={marks}
            min={-8}
            max={8}
          />
        </div>
      </div>
      <div className="grid-item">
        <div>Building {<br />} Characteristics</div>
      </div>
    </div>
  );
}
