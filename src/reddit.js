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

  const posts = response.map((post) => {
    if (!post.post_hint) { post.post_hint = ''; }

    if (post.is_self) {
      post.multi_type = 'self';
    } else if (isRedditHostedGif(post) || post.url.includes('gif') || post.url.includes('gfycat')) {
      post.multi_type = 'gif';
    } else if (post.is_video || post.post_hint.includes('video')) {
      post.multi_type = 'video';
    } else if (post.post_hint === 'image') {
      post.multi_type = 'image';
    } else if (post.post_hint === 'link') {
      post.multi_type = 'link';
    } else {
      console.debug('Could not identify type', post);
    }

    return post;
  });

  return posts;
};

export default getData;
