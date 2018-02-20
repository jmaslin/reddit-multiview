import React, { Component } from 'react';
import { Card, CardImg, CardBody, CardText, CardTitle, CardSubtitle } from 'reactstrap';

class ItemCard extends Component {
  isValidThumbnail() {
    const item = this.props.data;
    const isThumbnail = (
      item.thumbnail &&
      false === item.is_self &&
      item.thumbnail.includes('http')
    );

    return isThumbnail;
  }

  render() {
    const item = this.props.data;

    if (item.title.includes('woof')) {
      console.log('look here', item);
    }

    // TODO: Default thumbnail if none and not self post
    let showImg = '';

    if (item.url.includes('gif') && item.preview && item.preview.enabled === true) {
      showImg = <CardImg top width={item.preview.images[0].source.width} src={item.preview.images[0].source.url} alt={item.title} />
    } else if (this.isValidThumbnail()) {
      showImg = <CardImg top width={item.thumbnail_width} src={item.thumbnail} alt={item.title} />
    }


    return (
      <div>
        <Card>
          {showImg}
          <CardBody>
            <CardText><a target="_blank" href={`https://reddit.com${item.permalink}`}>{item.title}</a></CardText>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default ItemCard;