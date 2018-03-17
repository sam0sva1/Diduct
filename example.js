/** @jsx Diduct.createElement */
import Diduct from '../diduct';

const stories = [
  {
    name: 'Diduct introduction',
    url: 'http://bit.ly/2pX7HNn',
  },
  {
    name: 'Rendering DOM elements ',
    url: 'http://bit.ly/2qCOejH',
  },
  {
    name: 'Element creation and JSX',
    url: 'http://bit.ly/2qGbw8S',
  },
  {
    name: 'Instances and reconciliation',
    url: 'http://bit.ly/2q4A746',
  },
  {
    name: 'Components and state',
    url: 'http://bit.ly/2rE16nh',
  },
];

class App extends Diduct.Component {
  render() {
    return (
      <div>
        <h1>Diduct Stories</h1>
        <ul>
          {this.props.stories.map(story => <Story name={story.name} url={story.url} />)}
        </ul>
      </div>
    );
  }
}

class Story extends Diduct.Component {
  constructor(props) {
    super(props);
    this.state = { likes: Math.ceil(Math.random() * 100) };
  }
  like() {
    this.setState({
      likes: this.state.likes + 1
    });
  }
  render() {
    const { name, url } = this.props;
    const { likes } = this.state;
    return (
      <li>
        <button onClick={() => this.like()}>{likes}<span role="img" aria-label="heart">❤️</span></button>
        <a href={url}>{name}</a>
      </li>
    );
  }
}

Diduct.render(<App stories={stories} />, document.getElementById('root'));
