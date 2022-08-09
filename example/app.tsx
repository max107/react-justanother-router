import React, { createElement, FC, StrictMode } from 'react';
import { createBrowserHistory, Link, Redirect, RendererFunction, Route, RouterComponent, RouterEngine } from "../src";
import { createRoot } from 'react-dom/client';
import './app.css';

export type RouteProps = {
  auth?: boolean
} & DebugProps

const Header = () => <Link to='homepage'>Homepage</Link>

type DebugProps = {
  params: any
  query: any
}
const Debug: FC<DebugProps> = ({ params, query }) => (
  <div>
    <hr/>
    <div>Debug:</div>
    <div></div>
    <div>Params: {JSON.stringify(params)}</div>
    <div>Query: {JSON.stringify(query)}</div>
  </div>
)

export const routes: Route<RouteProps>[] = [
  {
    name: 'homepage',
    path: '/',
    render: ({ params, query }: DebugProps) => (
      <div className='b-app'>
        <Header/>
        <div>homepage</div>
        <div>
          <Link to='signin'>Go to signin page</Link>
        </div>
        <div>
          <Link to='signin' query={{ foo: 'bar' }}>Go to signin page with query</Link>
        </div>
        <div>
          <Link to='user_view' params={{ id: 1 }}>Go to user #1</Link>
        </div>
        <div>
          <Link to='secure'>Go to secure page</Link>
        </div>
        <div>
          <a href='#' onClick={() => window.location.pathname = '/secure'}>Force to secure page</a>
        </div>
        <Debug params={params} query={query} />
      </div>
    )
  },
  {
    path: '/secure',
    name: 'secure',
    props: { auth: true },
    render: ({ params, query }: DebugProps) => (
      <div className='b-app'>
        <Header/>
        <div>secure</div>
        <Debug params={params} query={query} />
      </div>
    )
  },
  {
    path: '/signin',
    name: 'signin',
    render: ({ params, query }: DebugProps) => (
      <div className='b-app'>
        <Header/>
        <div>signin</div>
        <Debug params={params} query={query} />
      </div>
    )
  },
  {
    path: '/user/:id(\\d+)',
    name: 'user_view',
    render: ({ params, query }: DebugProps) => (
      <div className='b-app'>
        <Header/>
        <div>User view: {params.id}</div>
        <Debug params={params} query={query} />
      </div>
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
const root = createRoot(rootNode!);
root.render(process.env.NODE_ENV === 'production' ? (
  <Root/>
) : (
  <StrictMode>
    <Root/>
  </StrictMode>
));
