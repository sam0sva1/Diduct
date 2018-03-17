const element = {
  type: 'div',
  props: {
    id: 'container',
    children: [
      { type: 'input', props: { value: 'foo', type: 'text' } },
      {
        type: 'a',
        props: {
          href: '/bar',
          children: [
            { type: 'TEXT ELEMENT', props: { nodeValue: 'bar' } },
          ],
        },
      },
      {
        type: 'span',
        props: {
          onClick: () => { alert('Hi'); },
          children: [
            {
              type: 'TEXT ELEMENT',
              props: { nodeValue: 'Foo' },
            },
          ],
        },
      },
    ],
  },
};

module.exports = element;
