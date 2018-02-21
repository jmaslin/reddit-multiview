import React, { Component } from 'react';
import { InputGroup, Input, InputGroupAddon, ButtonGroup, Button, Navbar, Nav, NavbarBrand, NavbarToggler, Collapse, NavItem, NavLink, Row, Col } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import { SectionHolder } from './Section';
import getData from './reddit';

/*
Components:
- form ( sort method, auth?, counts, geo filter, nsfw toggle (OFF=default))
- subreddit badge [if on popular/all only]
*/

class AppNav extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <Navbar dark fixed="true" color="primary" expand="md">
        <NavbarBrand href="/">Multiviewer for Reddit</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/components/">Components</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/reactstrap/reactstrap">Github</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

class App extends Component {
  constructor() {
    super();

    this.loadData = this.loadData.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.toggleType = this.toggleType.bind(this);

    this.state = {
      dataLoaded: false,
      data: [],
      subredditName: 'popular',
      postToggle: {
        self: true,
        image: true,
        video: true,
        gif: true,
        link: true
      }
    };
  }

  toggleType(evt) {
    const toggleName = evt.target.getAttribute('data-key');
    this.state.postToggle[toggleName] = !this.state.postToggle[toggleName];
    this.forceUpdate();
    console.debug('Toggles', this.state.postToggle);
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
    const self = this;

    const renderData = this.state.dataLoaded ?
      (<SectionHolder data={this.state.data} types={this.state.postToggle} />) :
      (<div>Loading</div>);

    const toggleButtons = ['self', 'image', 'video', 'gif', 'link'].map((type) => {
      const isNotToggled = this.state.postToggle[type] === false;
      return (<Button outline={isNotToggled} key={type} data-key={type} color="info" onClick={self.toggleType}>{type}</Button>)
    });

    return (
      <div className="App">
        <AppNav />
        <header className="App-header">
          <Row>
            <Col>
              <InputGroup>
                <InputGroupAddon addonType="prepend">r/</InputGroupAddon>
                <Input placeholder="Enter a subreddit name" value={this.state.subredditName} onChange={evt => this.updateInputValue(evt)} />
                <InputGroupAddon addonType="append"><Button onClick={this.loadData}>Load</Button></InputGroupAddon>
                <InputGroupAddon addonType="append"><Button onClick={this.loadData}>Refresh</Button></InputGroupAddon>
              </InputGroup>
            </Col>
            <Col>
              <ButtonGroup>
                {toggleButtons}
              </ButtonGroup>
            </Col>
            <Col>

            </Col>
          </Row>
        </header>
        {renderData}
      </div>
    );
  }
}

export default App;
