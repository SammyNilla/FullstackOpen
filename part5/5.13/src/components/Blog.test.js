import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import Blog from './Blog';

describe('when rendering blogs', () => {
  test('at start, shows essential info but not details', () => {
    const blog = {
      title: 'test blog',
      author: 'sammynilla',
      url: 'http://localhost:3003',
      likes: 4,
      user: {
        name: 'logged user',
      }
    };

    const component = render(
      <Blog blog={blog} />
    );

    const baseInfo = component.getByText(
      `${blog.title} ${blog.author}`
    );
    expect(baseInfo).toBeDefined();

    const details = component.container.querySelector('.details');
    expect(details).toHaveStyle('display: none');
  });
});