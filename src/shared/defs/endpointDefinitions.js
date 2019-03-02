import fetchUserPermissions from '../sql/fetch/userPermissions.sql';

export default {
  books: {
    path: '/books',
    name: 'books',
    singularDisplayName: 'book',
    table: 'books',
    fields: [
      {
        name: 'title',
      },
      {
        name: 'content',
      },
      {
        name: 'category_id',
      },
    ],
    overrideGetSql: 'SELECT books.id, books.title, books.content, books.category_id, book_categories.name AS category_name FROM books LEFT JOIN book_categories ON books.category_id = book_categories.id;',
  },
  bookCategories: {
    path: '/bookCategories',
    name: 'book categories',
    singularDisplayName: 'book category',
    table: 'book_categories',
    fields: [
      {
        name: 'name',
      },
      {
        name: 'color',
      },
    ],
  },
  servers: {
    path: '/servers',
    name: 'servers',
    singularDisplayName: 'server',
    table: 'servers',
    fields: [
      {
        name: 'name',
      },
      {
        name: 'url',
      },
      {
        name: 'port',
      },
      {
        name: 'access_level',
      },
    ],
  },
  config: {
    path: '/config',
    name: 'config',
    singularDisplayName: 'config',
    table: 'config',
    fields: [
      {
        name: 'cfg_key',
      },
      {
        name: 'cfg_value',
      },
    ],
    postFetch: (data) => {
      return data.reduce((output, { cfg_key, cfg_value }) => ({
        ...output,
        [cfg_key]: cfg_value
      }), {});
    },
  },
  permissions: {
    path: '/permissions',
    name: 'permissions',
    singularDisplayName: 'permission',
    table: 'permissions',
    fields: [
      {
        name: 'name',
      },
      {
        name: 'description',
      },
    ],
  },
  users: {
    path: '/users',
    name: 'users',
    singularDisplayName: 'user',
    table: 'users',
    fields: [
      {
        name: 'nickname',
      },
      {
        name: 'email',
      },
      {
        name: 'byond_key',
      },
    ],
  },
  userPermissions: {
    path: '/userPermissions',
    name: 'user permissions',
    singularDisplayName: 'user permission',
    table: 'user_permissions',
    fields: [
      {
        name: 'permission_id',
      },
      {
        name: 'user_id',
      },
    ],
    overrideGetSql: fetchUserPermissions,
  },
  userGroups: {
    path: '/userGroups',
    name: 'user groups',
    singularDisplayName: 'user group',
    table: 'user_groups',
    fields: [
      {
        name: 'name',
      },
      {
        name: 'description',
      },
    ],
  },
  groupMembers: {
    path: '/groupMembers',
    name: 'group members',
    singularDisplayName: 'group member',
    table: 'user_group_members',
    fields: [
      {
        name: 'user_id',
      },
      {
        name: 'group_id',
      },
    ],
  },
  groupPermissions: {
    path: '/groupPermissions',
    name: 'group permissions',
    singularDisplayName: 'group permission',
    table: 'user_group_permissions',
    fields: [
      {
        name: 'permission_id',
      },
      {
        name: 'group_id',
      },
    ],
  },
}