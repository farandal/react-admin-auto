import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Admin } from 'react-admin';
import { AutoResource } from 'react-admin-auto';

import fakeDataProvider from 'ra-data-fakerest';

const dataProvider = fakeDataProvider({
  posts: [
    { id: 0, author: 10, title: 'Hello, world!', views: 123, tags: ['1', '5', '10'] },
    { id: 1, author: 11, title: 'FooBar', views: 56789, tags: [] },
    { id: 2, author: 10, title: 'Goodbye, all.', views: 777, tags: ['5'] }
  ],
  users: [
    {
      id: 10,
      name: 'John Doe',
      description: 'An amazing architect!',
      social: [{ service: 'twitter', handle: '@amazing', followers: 1234 }]
    },
    {
      id: 11,
      name: 'Jane Doe',
      description: 'Enthusiastic Engineer',
      social: [
        { service: 'twitter', handle: '@engineer', followers: 5 },
        { service: 'insta', handle: '@engineer-forever', followers: 6 }
      ]
    }
  ]
});

enum Tags {
  Sports = '10',
  News = '5',
  Politics = '1'
}

const POST_SCHEMA = [
  {
    attribute: 'author',
    type: 'users.name'
  },
  {
    attribute: 'title',
    type: String
  },
  {
    attribute: 'views',
    type: Number,
    readOnly: true
  },
  {
    attribute: 'tags',
    type: [Tags]
  }
];

enum Service {
  Twitter = 'twitter',
  Instagram = 'insta',
  SnapChat = 'snap'
}

const USER_SCHEMA = [
  {
    attribute: 'name',
    type: String
  },
  {
    attribute: 'description',
    type: String
  },
  {
    attribute: 'social',
    type: [
      {
        attribute: 'service',
        type: Service
      },
      {
        attribute: 'handle',
        type: String
      },
      {
        attribute: 'followers',
        type: Number
      }
    ],
    inList: false
  }
];

const PostAdmin = AutoResource('posts', { schema: POST_SCHEMA });
const UserAdmin = AutoResource('users', {
  schema: USER_SCHEMA
});

class AdminHome extends React.Component {
  render() {
    return (
      <Admin dataProvider={dataProvider}>
        {PostAdmin}
        {UserAdmin}
      </Admin>
    );
  }
}

ReactDOM.render(<AdminHome />, document.getElementById('root') as HTMLElement);
