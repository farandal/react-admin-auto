import * as React from "react";
import * as ReactDOM from "react-dom";

import { Admin } from "react-admin";
import { AutoResource } from "react-admin-auto";

import fakeDataProvider from 'ra-data-fakerest';

const POST_SCHEMA = [
  {
    attribute: "title",
    type: String
  },
  {
    attribute: "views",
    type: Number
  }
];
const USER_SCHEMA = [
  {
    attribute: "name",
    type: String
  },
  {
    attribute: "description",
    type: String
  },
  {
    attribute: "social",
    type: [
      {
        attribute: "service",
        type: String
      },
      {
        attribute: "handle",
        type: String
      },
      {
        attribute: "followers",
        type: Number
      }
    ]
  }
];

const PostAdmin = AutoResource("posts", { schema: POST_SCHEMA });
const UserAdmin = AutoResource("users", {
  schema: USER_SCHEMA
});

const dataProvider = fakeDataProvider({
  posts: [
    { id: 0, title: "Hello, world!", views: 123 },
    { id: 1, title: "FooBar", views: 56789 }
  ],
  users: [
    {
      id: 0,
      name: "John Doe",
      description: "An amazing architect!",
      social: [{ service: "twitter", handle: "@amazing", followers: 1234 }]
    },
    {
      id: 1,
      name: "Jane Doe",
      description: "Enthusiastic Engineer",
      social: [
        { service: "twitter", handle: "@engineer", followers: 5 },
        { service: "instagram", handle: "@engineer-forever", followers: 6 }
      ]
    }
  ]
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

ReactDOM.render(<AdminHome />, document.getElementById("root") as HTMLElement);
