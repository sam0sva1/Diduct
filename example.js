/** @jsx Diduct.createElement */
import Diduct from '../diduct';

const randomLikes = () => Math.ceil(Math.random() * 100);
const stories = [
  {
    name: 'Diduct introduction',
    url: 'http://bit.ly/2pX7HNn',
    likes: randomLikes(),
  },
  {
    name: 'Rendering DOM elements ',
    url: 'http://bit.ly/2qCOejH',
    likes: randomLikes(),
  },
  {
    name: 'Element creation and JSX',
    url: 'http://bit.ly/2qGbw8S',
    likes: randomLikes(),
  },
  {
    name: 'Instances and reconciliation',
    url: 'http://bit.ly/2q4A746',
    likes: randomLikes(),
  },
  {
    name: 'Components and state',
    url: 'http://bit.ly/2rE16nh',
    likes: randomLikes(),
  },
];

const root = document.getElementById('root');

const appElement = () => <div><ul>{stories.map(storyElement)}</ul></div>;

function storyElement(story) {
  return (
    <li>
      <button onClick={() => handleClick(story)}>{story.likes}<span role="img" aria-label="heart">❤️</span></button>
      <a href={story.url}>{story.name}</a>
    </li>
  );
}

function handleClick(story) {
  story.likes += 1;
  Diduct.render(appElement(), document.getElementById('root'));
}

Diduct.render(appElement(), root);
