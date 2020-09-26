import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import Blog from './Blog';

let blog = {
  title: 'test blog',
  author: 'sammynilla',
  url: 'http://localhost:3003',
  likes: 0,
  user: {
    name: 'logged user',
  }
};

describe('<Blog />', () => {
  let component;

  beforeEach(() => {});

  test('at start, displays essential info but not details', () => {
    component = render(
      <Blog blog={blog} />
    );
    const baseInfo = component.getByText(
      `${blog.title} ${blog.author}`
    );
    expect(baseInfo).toBeDefined();

    const details = component.container.querySelector('.details');
    expect(details).toHaveStyle('display: none');
  });
  test('when clicked, details are displayed', () => {
    component = render(
      <Blog blog={blog} />
    );
    const button = component.getByText('view');
    fireEvent.click(button);

    const details = component.container.querySelector('.details');
    expect(details).not.toHaveStyle('display: none');
  });
  test('clicking like button twice calls event handler twice', () => {
    const mockHandler = jest.fn();

    component = render(
      <Blog blog={blog} handleUpdate={mockHandler} />
    );

    const button = component.getByText('like');
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});