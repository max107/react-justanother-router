import React, { createElement, FC, StrictMode } from 'react';
import { createHistory, Link, Redirect, RendererFunction, Route, Router, RouterEngine } from "../src";
import { createRoot } from 'react-dom/client';
import './reset.css';
import './app.css';

export type RouteProps = {
  auth?: boolean
} & DebugProps

const Header = () => (
  <>
    <Link to='homepage'>Homepage</Link>
    <hr/>
  </>
);

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

const HomePage: FC<DebugProps> = ({
  params,
  query
}) => (
  <div className='b-app'>
    <Header/>
    <div>
      <Link to='signin'>Go to signin page</Link>
    </div>
    <div>
      <Link to='withquery' query={{ foo: 'bar' }}>Go to page with query</Link>
    </div>
    <div>
      <Link to='user_view' params={{ id: 1 }}>Go to user #1</Link>
    </div>
    <div>
      <Link to='redirect'>Go to redirect page</Link>
    </div>
    <div>
      <Link to='user_view' params={{ id: 1 }} target='_blank'>
        Go to user #1 with _blank attribute
      </Link>
    </div>
    <div>
      <Link to='secure'>Go to secure page</Link>
    </div>
    <div>
      <Link to='child_route'>Go to child route</Link>
    </div>
    <div>
      <Link to='secure_redirect'>Redirect to secure_no_auth</Link>
    </div>
    <div>
      <Link to='secure_no_auth'>Go to secure page without auth</Link>
    </div>
    <div>
      <a href='#' onClick={() => window.location.pathname = '/secure'}>Force to secure page</a>
    </div>
    <Debug params={params} query={query}/>
  </div>
)

const RedirectPage: FC = () => {
  console.log('redirect page');

  return (
    <Redirect to='homepage'/>
  )
}

const SecurePage: FC<DebugProps> = ({
  params,
  query
}) => (
  <div className='b-app'>
    <Header/>
    <div>secure</div>
    <Debug params={params} query={query}/>
  </div>
)

const SecureRedirectPage: FC = () => (
  <Redirect to='secure_no_auth'/>
)

const SigninPage: FC<DebugProps> = ({
  params,
  query
}) => (
  <div className='b-app'>
    <Header/>
    <div>signin</div>
    <Debug params={params} query={query}/>
  </div>
);

const WithQueryPage: FC<DebugProps> = ({
  params,
  query
}) => (
  <div className='b-app'>
    <Header/>
    <div>withquery</div>
    <Debug params={params} query={query}/>
  </div>
)

type UserViewPageProps = Omit<DebugProps, 'params'> & {
  params: {
    id: number
  }
}

const UserViewPage: FC<UserViewPageProps> = ({
  params,
  query
}) => (
  <div className='b-app'>
    <Header/>
    <div>User view: {params.id}</div>
    <Debug params={params} query={query}/>
  </div>
)

const ChildPage: FC<DebugProps> = ({
  params,
  query
}) => (
  <div className='b-app'>
    <Header/>
    <div>ChildPage</div>
    <Debug params={params} query={query}/>
  </div>
)

export const routes: Route<RouteProps>[] = [
  { name: 'homepage', path: '/', component: HomePage },
  { name: 'redirect', path: '/redirect', component: RedirectPage },
  { name: 'secure', path: '/secure', props: { auth: true }, component: SecurePage },
  { name: 'secure_no_auth', path: '/secure_no_auth', component: SecurePage },
  { name: 'secure_redirect', path: '/secure_redirect', component: SecureRedirectPage },
  {
    path: '/child',
    children: [
      {
        name: 'child_route',
        path: '',
        component: ChildPage
      }
    ]
  },
  { name: 'signin', path: '/signin', component: SigninPage },
  { name: 'withquery', path: '/withquery', component: WithQueryPage },
  { name: 'user_view', path: '/user/:id(\\d+)', component: UserViewPage },
];


export const history = createHistory();

export const router = new RouterEngine(routes);

const renderer: RendererFunction<RouteProps> = (match): JSX.Element | null => {
  if (match.props?.auth) {
    return <Redirect to='signin' replace/>;
  }

  return createElement(match.component, { query: match.query, params: match.params });
};

export const Root = (): JSX.Element => {
  return (
    <Router
      history={history}
      router={router}
      renderer={renderer}
    />
  );
}

const rootNode = document.getElementById('root');
const root = createRoot(rootNode!);
// const useStrict = process.env.NODE_ENV === 'production';
const useStrict = false;
root.render(useStrict ? (
  <StrictMode>
    <Root/>
  </StrictMode>
) : (
  <Root/>
));
