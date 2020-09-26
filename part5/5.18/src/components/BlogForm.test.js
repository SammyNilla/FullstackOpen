import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import BlogForm from './BlogForm';

const blog = {
  title: 'test blog',
  author: 'sammynilla',
  url: 'http://localhost:3003',
};

describe('<BlogForm />', () => {
  beforeEach(() => {});
  test('onSubmit is called with correct details', () => {
    const mockHandler = jest.fn();
    const component = render(
      <BlogForm createBlog={mockHandler} />
    );

    const title = component.container.querySelector('#blogFormTitle');
    const author = component.container.querySelector('#blogFormAuthor');
    const url = component.container.querySelector('#blogFormUrl');
    const form = component.container.querySelector('form');

    fireEvent.change(title, { target: { value: `${blog.title}` }, });
    fireEvent.change(author, { target: { value: `${blog.author}` }, });
    fireEvent.change(url, { target: { value: `${blog.url}` }, });
    fireEvent.submit(form);

    expect(mockHandler.mock.calls).toHaveLength(1);
    expect(mockHandler.mock.calls[0][0].title).toBe(`${blog.title}`);
    expect(mockHandler.mock.calls[0][0].author).toBe(`${blog.author}`);
    expect(mockHandler.mock.calls[0][0].url).toBe(`${blog.url}`);
  });
});