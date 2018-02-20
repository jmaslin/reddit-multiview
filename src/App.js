import React, { Component } from 'react';
import { InputGroup, Input, InputGroupAddon, Button } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import { SectionHolder } from './Section';
import getData from './reddit';

/*
Components:
- form (subreddit name, sort method, auth, refresh, counts, geo filter, nsfw toggle (OFF=default))
- sections (text/self, video, img, gif)
*/

class App extends Component {
  constructor() {
    super();

    this.loadData = this.loadData.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);

    this.state = {
      dataLoaded: false,
      data: [],
      subredditName: 'popular'
    };
  }

  async loadData() {
    this.setState({
      dataLoaded: false
    });

    const redditData = await getData(this.state.subredditName);
    this.setState({
      dataLoaded: true,
      data: redditData
    });
  }

  async componentDidMount() {
    this.loadData(this.state.subredditName);
  }

  componentWillUpdate() {
    console.debug('Update app');
  }

  updateInputValue(evt) {
    this.setState({
      subredditName: evt.target.value
    });
  }

  render() {
    const renderData = this.state.dataLoaded ?
      (<SectionHolder data={this.state.data} />) :
      (<div>Loading</div>);

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Reddit Multiviewer</h1>
          <InputGroup>
            <InputGroupAddon addonType="prepend">r/</InputGroupAddon>
            <Input placeholder="Enter a subreddit name" value={this.state.subredditName} onChange={evt => this.updateInputValue(evt)} />
            <InputGroupAddon addonType="append"><Button onClick={this.loadData}>Load</Button></InputGroupAddon>
            <InputGroupAddon addonType="append"><Button onClick={this.loadData}>Refresh</Button></InputGroupAddon>
          </InputGroup>
        </header>
        {renderData}
      </div>
    );
  }
}

export default App;
