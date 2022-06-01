import * as React from "react";
import { create } from 'react-test-renderer';
import {
  createMemoryHistory,
  History,
  Link,
  Location,
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
      <Link to='foo-bar'>foo-bar</Link>
    </RouterProvider>
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

test('props.onClick is called when button is clicked', () => {
  expect(locations.length).toEqual(0);
  const fn = jest.fn();
  const tree = create(
    <RouterProvider history={history} router={router}>
      <Link to='foo-bar' onClick={fn}>foo-bar</Link>
    </RouterProvider>
  );
  const link = tree.root.findByType('a');
  expect(locations.length).toEqual(0);
  link.props.onClick();
  expect(fn.mock.calls.length).toEqual(1);
  expect(locations.length).toEqual(1);
});
