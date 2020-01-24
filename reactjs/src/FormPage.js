import React, { Component } from "react";
import SimpleTabs from "./FormTabs";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { url } from "./Config.js";
import SimpleBackdrop from "./SimpleBackdrop";

class FormPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabs: [0],
      shownTab: 0,
      formValues: {
        0: {
          economicEnvironment: 0,
          economicBuilding: 0,
          environmentBuilding: 0
        }
      },
      responseSuccessfull: false,
      emptyDataFrame: false,
      showSimpleBackdrop: false
    };
  }

  componentDidMount() {
    localStorage.clear();
  }

  changeTab = newValue => {
    this.setState({ shownTab: newValue });
  };

  handleSliderChange = (tabId, newValue, sliderName) => {
    this.setState(prevState => ({
      ...prevState,
      formValues: {
        ...prevState.formValues,
        [tabId]: {
          ...prevState.formValues[tabId],
          [sliderName]: newValue
        }
      }
    }));
  };

  handleFormattingOfFormValues = () => {
    let formattedFormValues = {};

    Object.keys(this.state.formValues).forEach(e => {
      let formattedFormValue = {};
      Object.entries(this.state.formValues[e]).forEach(([key, value]) => {
        if (value >= 0) {
          formattedFormValue[key] = value + 1;
          if (key === "economicEnvironment") {
            formattedFormValue["environmentEconomic"] = 1 / (value + 1);
          }
          if (key === "economicBuilding") {
            formattedFormValue["buildingEconomic"] = 1 / (value + 1);
          }
          if (key === "environmentBuilding") {
            formattedFormValue["buildingEnvironment"] = 1 / (value + 1);
          }
        } else if (value < 0) {
          formattedFormValue[key] = 1 / (-value + 1);
          if (key === "economicEnvironment") {
            formattedFormValue["environmentEconomic"] = -value + 1;
          }
          if (key === "economicBuilding") {
            formattedFormValue["buildingEconomic"] = -value + 1;
          }
          if (key === "environmentBuilding") {
            formattedFormValue["buildingEnvironment"] = -value + 1;
          }
        }
        formattedFormValue["economicEconomic"] = 1;
        formattedFormValue["buildingBuilding"] = 1;
        formattedFormValue["environmentEnvironment"] = 1;
      });

      formattedFormValues[e] = formattedFormValue;
    });

    return formattedFormValues;
  };

  normalizeFormValues = formattedFormValues => {
    let normalizedFormValues = {};

    Object.entries(formattedFormValues).forEach(([key, value]) => {
      let normalizedFormValue = {};

      const economicTotal =
        value["economicEconomic"] +
        value["buildingEconomic"] +
        value["environmentEconomic"];
      const buildingTotal =
        value["economicBuilding"] +
        value["buildingBuilding"] +
        value["environmentBuilding"];

      const environmentTotal =
        value["economicEnvironment"] +
        value["buildingEnvironment"] +
        value["environmentEnvironment"];
      //for economicEconomic
      normalizedFormValue["economicEconomic"] =
        value["economicEconomic"] / economicTotal;

      //for economicBuilding
      normalizedFormValue["economicBuilding"] =
        value["economicBuilding"] / buildingTotal;

      //for economicEnvironment
      normalizedFormValue["economicEnvironment"] =
        value["economicEnvironment"] / environmentTotal;

      //for buildingEconomic
      normalizedFormValue["buildingEconomic"] =
        value["buildingEconomic"] / economicTotal;

      //for buildingBuilding
      normalizedFormValue["buildingBuilding"] =
        value["buildingBuilding"] / buildingTotal;

      //for buildingEnvironment
      normalizedFormValue["buildingEnvironment"] =
        value["buildingEnvironment"] / environmentTotal;

      //for environmentEconomic
      normalizedFormValue["environmentEconomic"] =
        value["environmentEconomic"] / economicTotal;

      //for environmentBuilding
      normalizedFormValue["environmentBuilding"] =
        value["environmentBuilding"] / buildingTotal;

      //for environmentEnvironment
      normalizedFormValue["environmentEnvironment"] =
        value["environmentEnvironment"] / environmentTotal;

      //economic average
      normalizedFormValue["economicAverage"] =
        (normalizedFormValue["economicEconomic"] +
          normalizedFormValue["economicEnvironment"] +
          normalizedFormValue["economicBuilding"]) /
        3;
      //building average
      normalizedFormValue["buildingAverage"] =
        (normalizedFormValue["buildingEconomic"] +
          normalizedFormValue["buildingEnvironment"] +
          normalizedFormValue["buildingBuilding"]) /
        3;
      //environment average
      normalizedFormValue["environmentAverage"] =
        (normalizedFormValue["environmentEnvironment"] +
          normalizedFormValue["environmentBuilding"] +
          normalizedFormValue["environmentEconomic"]) /
        3;
      normalizedFormValues[key] = normalizedFormValue;
    });

    return normalizedFormValues;
  };

  alertConsistency = tabId => {
    window.alert(`User ${tabId + 1} isn't consistent with his preferences.`);
    this.setState({ shownTab: tabId });
  };
  checkConsistency = (formattedFormValues, normalizedFormValues) => {
    let consistencyRatios = {};

    Object.entries(formattedFormValues).forEach(([key, value]) => {
      const economicEconomicTimesEconomicAverage =
        formattedFormValues[key].economicEconomic *
        normalizedFormValues[key].economicAverage;
      const economicEnvironmentTimesEnvironmentAverage =
        formattedFormValues[key].economicEnvironment *
        normalizedFormValues[key].environmentAverage;
      const economicBuildingTimesBuildingAverage =
        formattedFormValues[key].economicBuilding *
        normalizedFormValues[key].buildingAverage;
      const environmentEnvironmentTimesEnvironmentAverage =
        formattedFormValues[key].environmentEnvironment *
        normalizedFormValues[key].environmentAverage;
      const environmentBuildingTimesEnvironmentAverage =
        formattedFormValues[key].environmentBuilding *
        normalizedFormValues[key].buildingAverage;
      const environmentEconomicTimesEconomicAverage =
        formattedFormValues[key].environmentEconomic *
        normalizedFormValues[key].economicAverage;
      const buildingBuildingTimesBuildingAverage =
        formattedFormValues[key].buildingBuilding *
        normalizedFormValues[key].buildingAverage;
      const buildingEconomicTimesEconomicAverage =
        formattedFormValues[key].buildingEconomic *
        normalizedFormValues[key].economicAverage;
      const buildingEnvironmentTimesEnvironmentAverage =
        formattedFormValues[key].buildingEnvironment *
        normalizedFormValues[key].environmentAverage;

      const economicWeightedSumValue =
        economicEconomicTimesEconomicAverage +
        economicBuildingTimesBuildingAverage +
        economicEnvironmentTimesEnvironmentAverage;
      const environmentWeightedSumValue =
        environmentEconomicTimesEconomicAverage +
        environmentBuildingTimesEnvironmentAverage +
        environmentEnvironmentTimesEnvironmentAverage;
      const buildingWeightedSumValue =
        buildingBuildingTimesBuildingAverage +
        buildingEconomicTimesEconomicAverage +
        buildingEnvironmentTimesEnvironmentAverage;

      const economicWeightedSumValueDividedByEconomicAverage =
        economicWeightedSumValue / normalizedFormValues[key].economicAverage;
      const environmentWeightedSumValueDividedByEnvironmentAverage =
        environmentWeightedSumValue /
        normalizedFormValues[key].environmentAverage;
      const buildingWeightedSumValueDividedByBuildingAverage =
        buildingWeightedSumValue / normalizedFormValues[key].buildingAverage;

      const lambdaMax =
        (economicWeightedSumValueDividedByEconomicAverage +
          environmentWeightedSumValueDividedByEnvironmentAverage +
          buildingWeightedSumValueDividedByBuildingAverage) /
        3;
      const consistencyIndex = (lambdaMax - 3) / 2;
      const randomIndex = 0.58;
      const consistencyRatio = consistencyIndex / randomIndex;

      consistencyRatios[key] = consistencyRatio;
    });

    return consistencyRatios;
  };

  restApiSend = normalizedFormValues => {
    let numberOfUsers = 0;
    let totalEconomicAverages = 0;
    let totalBuildingAverages = 0;
    let totalEnvironmentAverages = 0;

    Object.entries(normalizedFormValues).forEach(([key, value]) => {
      numberOfUsers++;
      totalEconomicAverages += value["economicAverage"];
      totalBuildingAverages += value["buildingAverage"];
      totalEnvironmentAverages += value["environmentAverage"];
    });

    const getAllLocalStorageItems = () => {
      let values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

      while (i--) {
        values.push(localStorage.getItem(keys[i]));
      }

      return values;
    };

    const localStorageItems = getAllLocalStorageItems();
    console.log(localStorageItems);
    let lats = 0;
    let lngs = 0;
    let locationCount = 0;
    localStorageItems.forEach(item => {
     const itemObject = JSON.parse(item);
      locationCount++;
      lats += itemObject.lat;
      lngs += itemObject.lng;
    });
    const midpoint = {
      longitude: lngs / locationCount,
      latitude: lats / locationCount
    };
    console.log(midpoint);
    const postData = {
      rentOrSale: this.props.match.params.type,
      formValues: {
        economicAverage: totalEconomicAverages / numberOfUsers,
        buildingAverage: totalBuildingAverages / numberOfUsers,
        environmentAverage: totalEnvironmentAverages / numberOfUsers
      },
      midpoint: midpoint,
      filters: {
        priceRange: this.props.priceRange,
        selectedFlatSizes: this.props.selectedFlatSizes
      },
      rangeOfDistance: 5
    };
    console.log(postData);
    axios
      .post(`${url}/getData`, postData)
      .then(response => {
        console.log(response);
        if (response.data === "emptyDataFrame") {
          this.setState(
            { showSimpleBackdrop: false },
            () => {
              setTimeout(function() {
                window.alert(
                  "We couldn't find a house in a optimal location that matches your filters."
                );
              });
              this.setState({ emptyDataFrame: true });
            },
            500
          );
        } else {
          this.setState({
            responseSuccessfull: true,
            showSimpleBackdrop: false
          });
          this.props.handleResponseAndPostData(response.data, postData);
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ showSimpleBackdrop: false });
        window.alert("There was a problem while connecting to the server.");
      });
  };

  handleSend = () => {
    if (
      localStorage.length === 0 ||
      localStorage.length < this.state.tabs.length
    ) {
      window.alert("Please enter location info for all users.");
      return;
    }

    const formattedFormValues = this.handleFormattingOfFormValues();
    const normalizedFormValues = this.normalizeFormValues(formattedFormValues);
    const consistencyRatios = this.checkConsistency(
      formattedFormValues,
      normalizedFormValues
    );

    let consistencyError = false;
    Object.entries(consistencyRatios).forEach(([key, value]) => {
      console.log(value);
      if (value > 0.1) {
        consistencyError = true;
        this.alertConsistency(parseInt(key, 10));
      }
    });

    if (consistencyError) {
      return;
    } else {
      this.setState({ showSimpleBackdrop: true });
      this.restApiSend(normalizedFormValues);
    }
  };
  renderRedirect = () => {
    if (typeof this.props.priceRange[0] === "undefined") {
      return <Redirect to="/" />;
    }
    if (this.state.emptyDataFrame) {
      return <Redirect to="/" />;
    }
    if (this.state.responseSuccessfull) {
      return <Redirect to="/results" />;
    }
  };

  render() {
    return (
      <div style={{ display: "inline-block", marginTop: "50px" }}>
        {this.renderRedirect()}
        {this.state.showSimpleBackdrop === true ? <SimpleBackdrop /> : <div />}
        <SimpleTabs
          tabs={this.state.tabs}
          shownTab={this.state.shownTab}
          changeTab={this.changeTab}
          formValues={this.state.formValues}
          handleSliderChange={this.handleSliderChange}
        />
        <Button
          variant="contained"
          color="primary"
          style={{
            float: "left",
            marginTop: "10px",
            borderRadius: "5px"
            // width: "20px"
          }}
          onClick={() => {
            this.setState(prevState => ({
              tabs: [
                ...prevState.tabs,
                prevState.tabs[prevState.tabs.length - 1] + 1
              ],
              shownTab: prevState.tabs[prevState.tabs.length - 1] + 1,
              formValues: {
                ...prevState.formValues,
                [prevState.tabs[prevState.tabs.length - 1] + 1]: {
                  economicEnvironment: 0,
                  economicBuilding: 0,
                  environmentBuilding: 0
                }
              }
            }));
          }}
        >
          +
        </Button>
        <Button
          variant="contained"
          color="secondary"
          style={{
            float: "right",
            marginTop: "10px",
            borderRadius: "5px"
            // width: "20px"
          }}
          onClick={this.handleSend}
        >
          Go
        </Button>
      </div>
    );
  }
}

export default FormPage;
