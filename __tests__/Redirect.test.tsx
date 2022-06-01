import * as React from "react";
import { create } from 'react-test-renderer';
import {
  createMemoryHistory,
  History,
  Location,
  Redirect,
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
]);

afterEach(() => {
  locations = [];
});

test('renders without error', () => {
  expect(locations.length).toEqual(0);
  const tree = create(
    <RouterProvider history={history} router={router}>
      <Redirect to='foo-bar'/>
    </RouterProvider>
  );
  expect(tree.toJSON()).toMatchSnapshot();
  expect(locations.length).toEqual(1);
});
