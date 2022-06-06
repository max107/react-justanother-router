import React, { createElement, StrictMode } from 'react';
import { createBrowserHistory, Link, Redirect, RendererFunction, Route, RouterComponent, RouterEngine } from "../src";
import { render } from "react-dom";

export type RouteProps = {
  auth?: boolean
}

const Header = () => <Link to='homepage'>Homepage</Link>

export const routes: Route<RouteProps>[] = [
  {
    name: 'homepage',
    path: '/',
    render: () => (
      <>
        <Header/>
        <div>homepage</div>
        <div>
          <Link to='secure'>Go to secure page</Link>
        </div>
        <div>
          <a href='#' onClick={() => window.location.pathname = '/secure'}>Force to secure page</a>
        </div>
      </>
    )
  },
  {
    path: '/secure',
    name: 'secure',
    props: { auth: true },
    render: () => (
      <>
        <Header/>
        <div>secure</div>
      </>
    )
  },
  {
    path: '/signin',
    name: 'signin',
    render: () => (
      <>
        <Header/>
        <div>signin</div>
      </>
    )
  },
];

export const history = createBrowserHistory();

export const router = new RouterEngine(routes);

const renderer: RendererFunction<RouteProps> = (match): JSX.Element | null => {
  if (match.props?.auth) {
    return <Redirect to='signin'/>;
  }

  return createElement(match.render, { query: match.query, params: match.params });
};

export const Root = (): JSX.Element => (
  <RouterComponent history={history} router={router} renderer={renderer}/>
);

const rootNode = document.getElementById('root');
const useStrict = false;
if (rootNode) {
  // https://github.com/facebook/react/issues/15074
  render(useStrict ? (
    <StrictMode>
      <Root/>
    </StrictMode>
  ) : (
    <Root/>
  ), rootNode);
}
