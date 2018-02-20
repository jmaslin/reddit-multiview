import React, { Component } from 'react';
import './App.css';
import { InputGroup, Input, InputGroupAddon, Button, Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';

import * as snoowrap from 'snoowrap';

import Config from './config';

const r = new snoowrap(Config);

const getData = async function getData(subreddit) {
  const data = {
    self: [],
    image: [],
    video: [],
    link: [],
    gif: []
  };

  console.debug('Get data for subreddit', subreddit);

  const response = subreddit && subreddit.length > 0 ?
    await r.getSubreddit(subreddit).getHot() :
    await r.getHot();

  if (!response || response.length === 0) {
    console.debug('Error', response);
  } else {
    console.debug('Res', response)
  }

  response.forEach((post) => {
    if (!post.post_hint) { post.post_hint = ''; }

    if (post.is_self) {
      data.self.push(post);
    } else if (post.is_video || post.post_hint.includes('video')) {
      data.video.push(post);
    } else if (post.post_hint === 'image') {
      data.image.push(post);
    } else if (post.post_hint === 'link') {
      data.link.push(post);
    } else {
      console.debug('Could not identify type', post);
    }
  });

  return data;
};

/*
Components:
- form (subreddit name, sort method, auth, refresh, counts)
- sections (text/self, video, img, gif)
*/

class SelfItems extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const postData = this.props.data.map((post, idx) => {
      return (
        <div key={"selfpost-"+idx}>{post.title}</div>
      )
    });

    return (
      <div>{postData}</div>
    )
  }
}

class ImageItems extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const postData = this.props.data.map((post, idx) => {
      return (
        <div key={"imagepost-"+idx}>
          <span>{post.title}</span>
          <img src={post.thumbnail} height={post.thumbnail_height} width={post.thumbnail_width} />
        </div>
      )
    });

    return (
      <div>{postData}</div>
    )
  }
}

class VideoItems extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const postData = this.props.data.map((post, idx) => {
      return (
        <div key={"videopost-"+idx}>
          <span>{post.title}</span>
          <img src={post.thumbnail} height={post.thumbnail_height} width={post.thumbnail_width} />
        </div>
      )
    });

    return (
      <div>{postData}</div>
    )
  }
}

// sections should be consistent across media types
// will hold components for media types
// (which are diff, e.g. <Self />, <Image />, <Gif />, <Video />)
class Section extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let items;

    switch (this.props.name) {
      case 'Self':
        items = (<SelfItems data={this.props.data.self} />)
        break;
      case 'Image':
        items = (<ImageItems data={this.props.data.image} />)
        break;
      case 'Video':
        items = (<VideoItems data={this.props.data.video} />)
      // case 'Gif':
      //
      // case 'Link':
    }

    return (
      <div>
        <div>{this.props.name} Posts</div>
        {items}
      </div>
    )
  }
}

class SectionHolder extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Row>
          <Col><Section name="Self" data={this.props.data} /></Col>
          <Col><Section name="Image" data={this.props.data} /></Col>
          <Col><Section name="Video" data={this.props.data} /></Col>
          <Col><Section name="Gif" data={this.props.data} /></Col>
          <Col><Section name="Link" data={this.props.data} /></Col>
        </Row>
      </Container>
    )
  }
}

class App extends Component {
  constructor() {
    super();

    this.loadData = this.loadData.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);

    this.state = {
      dataLoaded: false,
      data: [],
      subredditName: ''
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
            <Input value={this.state.subredditName} onChange={evt => this.updateInputValue(evt)} />
            <InputGroupAddon addonType="append"><Button onClick={this.loadData}>Load</Button></InputGroupAddon>
          </InputGroup>
        </header>
        {renderData}
      </div>
    );
  }
}

export default App;
