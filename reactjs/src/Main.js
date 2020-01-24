import React, { Component } from "react";
import axios from "axios";
export class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const postData = {
      message: this.state.message
    };

    //https://findmyhouse.appspot.com
    axios
      .post("https://findmyhouse.appspot.com/", postData)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Message</label>
        <input
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
        />
        <button type="submit">Send Message</button>
      </form>
    );
  }
}
