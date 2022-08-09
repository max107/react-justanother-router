import '@testing-library/jest-dom';
import * as React from "react";
import { createElement, FC, PropsWithChildren } from "react";
import { cleanup, render, waitFor } from '@testing-library/react';
import {
  createHistory,
  History,
  HistoryLocation,
  Redirect,
  RendererFunction,
  RouteMatch,
  Router,
  RouterEngine,
  RouterEngineInterface,
} from "../src";

const router: RouterEngineInterface = new RouterEngine([
  { path: '/', name: 'homepage', component: () => <div>homepage</div> },
  { path: '/foobar', name: 'foo-bar', component: () => <div>foo-bar</div> },
  {
    path: '/nested', children: [
      { path: '/foobar', name: 'nested-foo-bar', component: () => <div data-testid="nested">nested-foo-bar</div> },
    ]
  },
  {
    name: 'nomatch',
    path: '(.*)',
    component: () => <div>not found</div>,
  },
]);

afterEach(() => {
  cleanup();
});

test('render', async () => {
  const locations: HistoryLocation[] = [];
  const history: History = createHistory();
  history.listen((location) => locations.push(location));

  const renderer: RendererFunction = (): JSX.Element | null => (
    <div data-testid="list">
      <div>hello</div>
    </div>
  );

  expect(locations.length).toEqual(0);
  const { getByTestId, asFragment } = render(
    <Router history={history} router={router} renderer={renderer}/>
  );
  expect(getByTestId('list')).toBeInTheDocument();
});

test('render_redirect', async () => {
  window.history.pushState({}, '', '/track/create');

  const locations: HistoryLocation[] = [];
  const history: History = createHistory();
  history.listen((location) => locations.push(location));

  const router: RouterEngineInterface = new RouterEngine([
    { path: '/track/create', name: 'track_create', props: { auth: true }, component: () => <div>track_create</div> },
    { path: '/auth/login', name: 'auth_login', component: () => <div>auth_login</div> },
  ]);

  const renderer: RendererFunction<{ auth?: boolean }> = ({ component, props, ...rest }) => {
    if (props?.auth) {
      return <Redirect to='auth_login'/>;
    }

    return createElement(component, rest);
  }

  render(
    <Router history={history} router={router} renderer={renderer}/>
  );
  expect(history.location.pathname).toBe('/auth/login');
});

test('render_child', async () => {
  window.history.pushState({}, '', '/');

  const locations: HistoryLocation[] = [];
  const history: History = createHistory();
  history.listen((location) => locations.push(location));

  const renderer: RendererFunction = ({ component, ...rest }) => (
    <div data-testid="child">
      {createElement(component, rest)}
    </div>
  );

  expect(locations.length).toEqual(0);
  const { getByTestId, asFragment } = render(
    <Router history={history} router={router} renderer={renderer}/>
  );
  expect(getByTestId('child')).toBeInTheDocument();

  window.history.pushState({}, '', '/foobar');
  await waitFor(() => {
    expect(history.location.pathname).toBe('/foobar');
  });
  expect(locations.length).toEqual(1);
});

test('render_nested', async () => {
  window.history.pushState({}, '', '/nested/foobar');

  const locations: HistoryLocation[] = [];
  const history: History = createHistory();
  history.listen((location) => locations.push(location));

  const renderer: RendererFunction = ({ component, ...rest }) => createElement(component, rest);

  expect(locations.length).toEqual(1);
  const { getByTestId, asFragment } = render(
    <Router history={history} router={router} renderer={renderer}/>
  );
  expect(getByTestId('nested')).toBeInTheDocument();
});

test('render_notfound', async () => {
  window.history.pushState({}, '', '/unknown_url');

  const locations: HistoryLocation[] = [];
  const history: History = createHistory();
  history.listen((location) => locations.push(location));

  const renderer: RendererFunction = (match: RouteMatch): JSX.Element | null => (
    <div data-testid="child">
      {createElement(match.component, { params: match.params, query: match.query })}
    </div>
  );

  expect(locations.length).toEqual(1);
  const { getByTestId } = render(
    <Router history={history} router={router} renderer={renderer}/>
  );
  expect(getByTestId('child')).toHaveTextContent('not found');
});

test('render_layout', async () => {
  window.history.pushState({}, '', '/');

  const locations: HistoryLocation[] = [];
  const history: History = createHistory();
  history.listen((location) => locations.push(location));

  const Layout: FC<PropsWithChildren<never>> = ({ children }): JSX.Element => (
    <div data-testid="layout">
      layout-wrapper
      <div>{children}</div>
    </div>
  );

  const router: RouterEngineInterface = new RouterEngine([
    {
      name: 'layout',
      component: () => <div>children</div>,
      props: {
        layout: Layout
      },
    },
  ]);

  const renderer: RendererFunction<{ layout: string }> = ({ component, props: { layout }, ...rest }) => {
    const child = createElement(component, rest);
    const target = layout
      ? createElement(layout, rest, child)
      : child;

    return (
      <div>
        {target}
      </div>
    );
  };

  expect(locations.length).toEqual(0);
  const { getByTestId } = render(
    <Router history={history} router={router} renderer={renderer}/>
  );

  expect(getByTestId('layout')).toBeInTheDocument();
});
