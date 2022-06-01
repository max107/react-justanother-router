import * as React from "react";
import { createElement, FC, PropsWithChildren } from "react";
import '@testing-library/jest-dom';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import {
  createMemoryHistory,
  History,
  Location,
  RendererFunction,
  RouteMatch,
  Router,
  RouterEngine,
  RouterEngineInterface,
  RouterProvider,
  Update
} from "../src";

let locations: Location[] = [];

const history: History = createMemoryHistory();
history.listen(({ location }: Update): void => {
  locations.push(location);
});

const router: RouterEngineInterface = new RouterEngine([
  { path: '/', name: 'homepage', render: () => <div>homepage</div> },
  { path: '/foobar', name: 'foo-bar', render: () => <div>foo-bar</div> },
  {
    path: '/nested', children: [
      { path: '/foobar', name: 'nested-foo-bar', render: () => <div>nested-foo-bar</div> },
    ]
  },
  {
    name: 'nomatch',
    path: '(.*)',
    render: () => <div>not found</div>,
  },
]);

afterEach(() => {
  locations = [];
  cleanup();
});

test('render', async () => {
  const renderer: RendererFunction = (): JSX.Element | null => (
    <div data-testid="list">
      <div>hello</div>
    </div>
  );

  expect(locations.length).toEqual(0);
  const { getByTestId, asFragment } = render(
    <RouterProvider history={history} router={router}>
      <Router renderer={renderer}/>
    </RouterProvider>
  );
  const listNode = await waitFor(() => getByTestId('list'));
  expect(listNode.children).toHaveLength(1);
  expect(asFragment()).toMatchSnapshot();
});

test('render_initial', async () => {
  const renderer: RendererFunction = (match: RouteMatch): JSX.Element | null => (
    <div data-testid="child">
      {createElement(match.render, { params: match.params, query: match.query })}
    </div>
  );

  const history: History = createMemoryHistory({
    initialEntries: [
      {
        hash: '',
        key: '',
        pathname: '/nested/foobar',
        search: '',
      }
    ]
  });
  const { getByTestId, asFragment } = render(
    <RouterProvider history={history} router={router}>
      <Router renderer={renderer}/>
    </RouterProvider>
  );
  const listNode = await waitFor(() => getByTestId('child'));
  expect(listNode.children).toHaveLength(1);
  expect(asFragment()).toMatchSnapshot();
  expect(listNode).toHaveTextContent('nested-foo-bar');
});

test('render_child', async () => {
  const renderer: RendererFunction = (match: RouteMatch): JSX.Element | null => (
    <div data-testid="child">
      {createElement(match.render, { params: match.params, query: match.query })}
    </div>
  );

  expect(locations.length).toEqual(0);
  const { getByTestId, asFragment } = render(
    <RouterProvider history={history} router={router}>
      <Router renderer={renderer}/>
    </RouterProvider>
  );
  const homepageRoute = await waitFor(() => getByTestId('child'));
  expect(homepageRoute.children).toHaveLength(1);
  expect(asFragment()).toMatchSnapshot();
  expect(homepageRoute).toHaveTextContent('homepage');

  act(() => {
    history.push('/foobar');
  });

  const foobarRoute = await waitFor(() => getByTestId('child'));
  expect(foobarRoute.children).toHaveLength(1);
  expect(asFragment()).toMatchSnapshot();
  expect(foobarRoute).toHaveTextContent('foo-bar');
});

test('render_nested', async () => {
  const renderer: RendererFunction = (match: RouteMatch): JSX.Element | null => (
    <div data-testid="child">
      {createElement(match.render, { params: match.params, query: match.query })}
    </div>
  );

  expect(locations.length).toEqual(0);
  const { getByTestId, asFragment } = render(
    <RouterProvider history={history} router={router}>
      <Router renderer={renderer}/>
    </RouterProvider>
  );

  act(() => {
    history.push('/nested');
  });

  const notFoundRoute = await waitFor(() => getByTestId('child'));
  expect(notFoundRoute.children).toHaveLength(1);
  expect(asFragment()).toMatchSnapshot();
  expect(notFoundRoute).toHaveTextContent('not found');

  act(() => {
    history.push('/nested/foobar');
  });

  const nestedRoute = await waitFor(() => getByTestId('child'));
  expect(nestedRoute.children).toHaveLength(1);
  expect(asFragment()).toMatchSnapshot();
  expect(nestedRoute).toHaveTextContent('nested-foo-bar');
});

test('render_notfound', async () => {
  const renderer: RendererFunction = (match: RouteMatch): JSX.Element | null => (
    <div data-testid="child">
      {createElement(match.render, { params: match.params, query: match.query })}
    </div>
  );

  expect(locations.length).toEqual(0);
  const { getByTestId, asFragment } = render(
    <RouterProvider history={history} router={router}>
      <Router renderer={renderer}/>
    </RouterProvider>
  );

  act(() => {
    history.push('/unknown_url');
  });

  const notFoundRoute = await waitFor(() => getByTestId('child'));
  expect(notFoundRoute.children).toHaveLength(1);
  expect(asFragment()).toMatchSnapshot();
  expect(notFoundRoute).toHaveTextContent('not found');
});

test('render_layout', async () => {
  const Layout: FC<PropsWithChildren<never>> = ({ children }): JSX.Element => (
    <div>
      layout-wrapper
      <div>{children}</div>
    </div>
  );

  const router: RouterEngineInterface = new RouterEngine([
    {
      path: '/layout',
      name: 'layout',
      render: () => <div>children</div>,
      props: {
        layout: Layout
      },
    },
  ]);

  const renderer: RendererFunction<{ layout: string }> = (match): JSX.Element | null => {
    const props = { params: match.params, query: match.query };
    const child = createElement(match.render, props);
    const target = match.props.layout
      ? createElement(match.props.layout, props, child)
      : null;

    return (
      <div data-testid="child">
        {target}
      </div>
    );
  };

  expect(locations.length).toEqual(0);
  const { getByTestId, asFragment } = render(
    <RouterProvider history={history} router={router}>
      <Router renderer={renderer}/>
    </RouterProvider>
  );

  act(() => {
    history.push('/layout');
  });

  const notFoundRoute = await waitFor(() => getByTestId('child'));
  expect(notFoundRoute.children).toHaveLength(1);
  expect(asFragment()).toMatchSnapshot();
  expect(notFoundRoute).toHaveTextContent('layout-wrapperchildren');
});
