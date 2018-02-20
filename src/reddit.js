import * as snoowrap from 'snoowrap';
import Config from './config';

const r = new snoowrap(Config);

const isRedditHostedGif = function isRedditHostedGif(post) {
  if (post.media && post.media.reddit_video && true === post.media.reddit_video.is_gif) {
    return true;
  } else {
    return false;
  }
};

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
    } else if (isRedditHostedGif(post) || post.url.includes('gif')) {
      data.gif.push(post);
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

export default getData;
