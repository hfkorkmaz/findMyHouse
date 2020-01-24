import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./LandingPage";
import FilterPage from "./FilterPage";
import FormPage from "./FormPage";
import ResultsPage from "./ResultsPage";
import AboutUs from "./AboutUs";
import HowItWorks from "./HowItWorks";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFlatSizes: [],
      priceRange: [],
      responseData: [],
      postData: {}
    };
  }

  handleSelectedFlatSizes = selectedFlatSizes => {
    this.setState({ selectedFlatSizes: selectedFlatSizes });
  };
  handlePriceRangeChange = priceRange => {
    this.setState({ priceRange: priceRange });
  };

  handleResponseAndPostData = (responseData, postData) => {
    this.setState({ responseData: responseData, postData: postData });
  };


  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route path={["/"]} exact component={LandingPage} />
          <Route
            path={["/:type/filter"]}
            render={props => (
              <FilterPage
                {...props}
                handleSelectedFlatSizes={this.handleSelectedFlatSizes}
                handlePriceRangeChange={this.handlePriceRangeChange}
              />
            )}
          />
          <Route
            path={["/:type/form"]}
            render={props => (
              <FormPage
                {...props}
                priceRange={this.state.priceRange}
                selectedFlatSizes={this.state.selectedFlatSizes}
                handleResponseAndPostData={this.handleResponseAndPostData}
              />
            )}
          />
          <Route
            path={["/results"]}
            render={props => (
              <ResultsPage
                {...props}
                postData={this.state.postData}
                results={this.state.responseData}
              />
            )}
          />

          <Route path="/aboutUs" exact component={AboutUs} />
          <Route path="/howItWorks" exact component={HowItWorks} />

        </div>
      </BrowserRouter>
    );
  }
}

export default App;
