import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles(theme => ({
  root: {
    width: 300,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10px"
  }
}));

function valuetext(value) {
  return `${value} TL`;
}

export default function RangeSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.value);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.handlePriceSliderChange(newValue);
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        Price Range
      </Typography>
      <Slider
        min={props.min}
        max={props.max}
        marks={props.marks}
        step={props.step}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </div>
  );
}
