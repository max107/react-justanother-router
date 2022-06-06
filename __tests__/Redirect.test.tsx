import React from "react";
import { createElement } from "react";
import { create } from 'react-test-renderer';
import {
  createMemoryHistory,
  History,
  Location,
  Redirect,
  RendererFunction,
  Router,
  RouterEngine,
  RouterEngineInterface,
  Update
} from "../src";

let locations: Location[] = [];

const history: History = createMemoryHistory({
  initialEntries: [{ pathname: '/' }]
});
history.listen(({ location }: Update) => {
  locations.push(location);
});

const router: RouterEngineInterface = new RouterEngine([
  { path: '/', name: 'homepage', render: () => <Redirect to='foo-bar'/> },
  { path: '/foobar', name: 'foo-bar', render: () => <div data-testid="foo-bar">foo-bar</div> },
]);

afterEach(() => {
  locations = [];
});

test('renders without error', async () => {
  expect(locations.length).toEqual(0);
  const renderer: RendererFunction = ({ render, ...rest }): JSX.Element | null => createElement(render, rest);
  const tree = create(
    <Router history={history} router={router} renderer={renderer}/>
  );
  expect(tree.toJSON()).toMatchSnapshot();
  expect(locations.length).toEqual(1);
  expect(locations.pop()?.pathname).toEqual('/foobar');
});
