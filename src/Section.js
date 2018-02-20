import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import ItemCard from './ItemCard';

class Section extends Component {
  render() {
    // const itemType = this.props.name.toLowerCase();
    const items = this.props.data.map((post) => {
      return (<ItemCard key={post.id} data={post} />)
    });
    const sectionName = this.props.name.charAt(0).toUpperCase() + this.props.name.slice(1);

    return (
      <div>
        <div>{sectionName} Posts</div>
        {items}
      </div>
    )
  }
}

class SectionHolder extends Component {
  render() {
    const data = this.props.data;

    const sections = ['self', 'image', 'video', 'gif', 'link']
      .filter((section) => {
        return data[section].length > 0;
        // TODO: if section is being filtered out as well
      })
      .map((section) => {
        return (
          <Col key={section}><Section name={section} data={data[section]} /></Col>
        )
      });

    return (
      <Container fluid>
        <Row>
          {sections}
        </Row>
      </Container>
    )
  }
}

export { Section, SectionHolder };
