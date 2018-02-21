import React, { Component } from 'react';
import { Container, Row, Col, CardColumns, Badge } from 'reactstrap';
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
        <Badge color="primary">{sectionName} Posts</Badge>
        <div>{items}</div>
      </div>
    )
  }
}

class SectionHolder extends Component {
  render() {
    const data = this.props.data;
    const typesToShow = this.props.types;

    // const sections = ['self', 'image', 'video', 'gif', 'link']
    //   .filter((section) => {
    //     return data[section].length > 0;
    //     // TODO: if section is being filtered out as well
    //   })
    //   .map((section) => {
    //     return (
    //       <Col key={section}><Section name={section} data={data[section]} /></Col>
    //     )
    //   });

      const items = this.props.data
      .filter((post) => {
        return typesToShow[post.multi_type] === true;
      })
      .map((post) => {
        return (<ItemCard key={post.id} data={post} />)
      });

    return (
      <Container fluid>
        <Row>
          <CardColumns>
            {items}
          </CardColumns>
        </Row>
      </Container>
    )
  }
}

export { Section, SectionHolder };
