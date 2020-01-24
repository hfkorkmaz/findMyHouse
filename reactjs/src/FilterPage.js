import React, { Component } from "react";
import MultipleSelect from "./FlatSizeSelect";
import RangeSlider from "./PriceSlider";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

class FilterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.match.params.type,
      selectedFlatSizes: [],
      priceRange: [0, 15000]
    };
  }

  componentDidMount() {
    if (this.props.match.params.type === "sale") {
      this.setState({ priceRange: [260000, 750000] });
      this.props.handlePriceRangeChange([260000, 750000]);
    } else if (this.props.match.params.type === "rent") {
      this.setState({ priceRange: [2000, 15000] });
      this.props.handlePriceRangeChange([2000, 15000]);
    }
  }

  handleSelectFlatSizes = selectedFlatSizes => {
    this.setState({ selectedFlatSizes: selectedFlatSizes });
    this.props.handleSelectedFlatSizes(selectedFlatSizes);
  };

  handlePriceSliderChange = priceRange => {
    this.setState({ priceRange: priceRange });
    this.props.handlePriceRangeChange(priceRange);
  };

  render() {
    if (this.state.priceRange[0] === 0) {
      return <div />;
    } else {
      return (
        <div
          style={{
            display: "inline-block",
            // backgroundColor: "#eeee",
            marginTop: "100px"
          }}
        >
          <h1>Give us a little more info.</h1>
          <MultipleSelect handleSelectFlatSizes={this.handleSelectFlatSizes} />

          <div>
            {this.state.type === "sale" ? (
              <RangeSlider
                handlePriceSliderChange={this.handlePriceSliderChange}
                value={this.state.priceRange}
                min={30000}
                max={1000000}
                step={10000}
                marks={[
                  { value: 30000, label: `30.000 TL` },
                  { value: 1000000, label: `1.000.000 TL` }
                ]}
              />
            ) : (
              <RangeSlider
                handlePriceSliderChange={this.handlePriceSliderChange}
                value={this.state.priceRange}
                min={150}
                max={48000}
                step={500}
                marks={[
                  { value: 150, label: `150 TL` },
                  { value: 48000, label: `48.000 TL` }
                ]}
              />
            )}
            {typeof this.state.selectedFlatSizes[0] === "undefined" ? (
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to={`/${this.props.match.params.type}/form`}
                disabled
              >
                Go
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to={`/${this.props.match.params.type}/form`}
              >
                Go
              </Button>
            )}
          </div>
        </div>
      );
    }
  }
}

export default FilterPage;
