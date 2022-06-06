import * as React from "react";
import { createElement } from "react";
import { act, create } from 'react-test-renderer';
import {
  createMemoryHistory,
  History,
  Link,
  Location,
  RendererFunction,
  RouterEngine,
  RouterEngineInterface,
  Router,
  Update
} from "../src";

let locations: Location[] = [];

const history: History = createMemoryHistory({
  initialEntries: [{
    pathname: '/'
  }]
});
history.listen(({ location }: Update): void => {
  locations.push(location);
});

afterEach(() => {
  locations = [];
});

test('renders without error', () => {
  const router: RouterEngineInterface = new RouterEngine([
    { path: '/', name: 'homepage', render: () => <div>homepage</div> },
    { path: '/foobar', name: 'foo-bar', render: () => <div>foo-bar</div> },
  ]);

  expect(locations.length).toEqual(0);
  const renderer: RendererFunction = ({ render, ...rest }): JSX.Element | null => createElement(render, rest);
  const tree = create(
    <Router renderer={renderer} history={history} router={router}>
      <Link to='foo-bar'>foo-bar</Link>
    </Router>
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

test('props.onClick is called when button is clicked', () => {
  expect(locations.length).toEqual(0);
  const renderer: RendererFunction = ({ render, ...rest }): JSX.Element | null => createElement(render, rest);
  const fn = jest.fn();
  const router = new RouterEngine([
    {
      path: '/', name: 'homepage', render: () => (
        <div>
          <div>homepage</div>
          <Link data-testid="link" to='foo-bar' onClick={fn}>foo-bar</Link>
        </div>
      )
    },
    { path: '/foobar', name: 'foo-bar', render: () => <div>foo-bar</div> },
  ]);
  const tree = create(
    <Router history={history} router={router} renderer={renderer}/>
  );
  const link = tree.root.findByType('a');
  expect(locations.length).toEqual(0);
  act(() => {
    link.props.onClick();
  });
  expect(fn.mock.calls.length).toEqual(1);
  expect(locations.length).toEqual(1);
});
