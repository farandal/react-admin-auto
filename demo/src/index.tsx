import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Admin } from 'react-admin';
import { AutoResource } from 'react-admin-auto';

import fakeDataProvider from 'ra-data-fakerest';

const dataProvider = fakeDataProvider({
  tags: [{ id: '1', name: 'Tag One' }, { id: '5', name: 'Tag Five' }, { id: '10', name: 'Tag Ten' }],
  posts: [
    {
      id: 0,
      date: new Date('2018-09-01T12:34:56'),
      author: 10,
      readers: [11],
      title: 'Hello, world!',
      post: '7, 8, 9',
      views: 123,
      tags: ['1', '5', '10']
    },
    {
      id: 1,
      date: '2018-09-06T12:34:56',
      author: 11,
      title: 'Is this really a title?',
      post: '4, 5, 6',
      views: 56789,
      tags: []
    },
    {
      id: 2,
      date: new Date('2018-09-04T12:34:56'),
      author: 10,
      readers: [11, 12],
      title: 'Goodbye, all.',
      post: '1, 2, 3',
      views: 777,
      tags: ['5']
    }
  ],
  users: [
    {
      id: 10,
      name: 'John Doe',
      description: 'An amazing architect!',
      address: '54 Somewhere St\nNew York, NY 10001',
      phone: '(650) 987 6543',
      email: 'john@doe.com',
      social: [{ service: 'twitter', handle: '@amazing', followers: 1234 }]
    },
    {
      id: 11,
      name: 'Jane Doe',
      description: 'Enthusiastic Engineer',
      address: '101 Elsewhere St\nNew York, NY 10001',
      phone: '(650) 675 4898',
      email: 'Jane@doe.com',
      social: [
        { service: 'twitter', handle: '@engineer', followers: 5 },
        { service: 'insta', handle: '@engineer-forever', followers: 6 }
      ]
    },
    {
      id: 12,
      name: 'July Doe',
      description: 'Car Crasher',
      address: '54 Somewhere St\nNew York, NY 10001',
      phone: '(650) 453 6161',
      email: 'july@doe.com'
    }
  ]
});

const TAG_SCHEMA = [
  {
    attribute: 'name',
    type: String
  }
];

const POST_SCHEMA = [
  {
    attribute: 'date',
    type: Date,
    showTime: true,
    label: 'Creation'
  },
  {
    attribute: 'author',
    type: 'users.name'
  },
  {
    attribute: 'readers',
    type: ['users.name'],
    inList: false,
    readOnly: true
  },
  {
    attribute: 'title',
    type: String,
    label: 'Title of the post'
  },
  {
    attribute: 'post',
    type: String,
    richText: true
  },
  {
    attribute: 'views',
    type: Number,
    readOnly: true
  },
  {
    attribute: 'tags',
    type: ['tags.name']
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
    attribute: 'address',
    type: String,
    tab: 'Contact Information',
    inList: false
  },
  {
    attribute: 'phone',
    type: String,
    tab: 'Contact Information',
    inList: false
  },
  {
    attribute: 'email',
    type: String,
    tab: 'Contact Information',
    inList: false
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

const TagAdmin = AutoResource('tags', { schema: TAG_SCHEMA });
const PostAdmin = AutoResource('posts', { schema: POST_SCHEMA });
const UserAdmin = AutoResource('users', {
  schema: USER_SCHEMA
});

class AdminHome extends React.Component {
  render() {
    return (
      <Admin dataProvider={dataProvider}>
        {TagAdmin}
        {PostAdmin}
        {UserAdmin}
      </Admin>
    );
  }
}

ReactDOM.render(<AdminHome />, document.getElementById('root') as HTMLElement);
