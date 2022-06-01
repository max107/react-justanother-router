import { buildRoutes, Route, RouterEngine, RouterEngineInterface } from "../src";

const routes = [
  {
    path: '/list',
    name: 'list',
    render: () => null,
    props: {},
  },
  {
    path: '/view/:id',
    name: 'view',
    render: () => null,
    props: {},
  },
  {
    path: '/view_strict/:id(\\d+)',
    name: 'view_strict',
    render: () => null,
    props: {},
  },
];

test('routing_url_for', async () => {
  const router: RouterEngineInterface = new RouterEngine(routes);
  expect(router.urlFor('list')).toEqual('/list');
  expect(router.urlFor('view', { id: '1' })).toEqual('/view/1');
  expect(router.urlFor('view', { id: 1 })).toEqual('/view/1');
  const t = () => {
    router.urlFor('view', { id: null });
  };
  expect(t).toThrow('Expected "id" to be a string');
});

test('routing_match', async () => {
  const router: RouterEngineInterface = new RouterEngine(routes);
  expect(router.match('/layout?foo=bar')).toEqual(null);
  expect(router.match('/list?foo=bar')).toEqual({
    name: 'list',
    params: {},
    props: {},
    query: {
      foo: 'bar',
    },
    render: expect.any(Function)
  });
  expect(router.match('/view/1?foo=bar')).toEqual({
    name: 'view',
    params: {
      id: '1',
    },
    props: {},
    query: {
      foo: 'bar',
    },
    render: expect.any(Function)
  });
  expect(router.match('/view/null?foo=bar')).toEqual({
    name: 'view',
    params: {
      id: 'null',
    },
    props: {},
    query: {
      foo: 'bar',
    },
    render: expect.any(Function)
  });
  expect(router.match('/view_strict/1?foo=bar')).toEqual({
    name: 'view_strict',
    params: {
      id: '1',
    },
    props: {},
    query: {
      foo: 'bar',
    },
    render: expect.any(Function)
  });
  expect(router.match('/view_strict/null?foo=bar')).toEqual(null);
});

test('buildRoutes', async () => {
  const routes: Route[] = [
    {
      name: 'parent',
      path: '/blog',
      children: [
        { name: 'child1', path: '/:post_id', render: () => null }
      ]
    }
  ];
  const result = buildRoutes(routes, '/');
  expect(result).toHaveLength(1);
  expect(result).toEqual([
    expect.objectContaining({
      name: 'child1',
      path: '/blog/:post_id',
      render: expect.any(Function),
      props: {},
      route: {
        match: expect.any(Function),
        tokens: [
          expect.objectContaining({
            modifier: '',
            name: 'post_id',
            pattern: expect.any(String),
            prefix: '/',
            suffix: '',
          })
        ]
      }
    }),
  ]);
});
