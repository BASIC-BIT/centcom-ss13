import fetchUserPermissions from '../sql/fetch/userPermissions.sql';

export default {
  books: {
    path: '/books',
    name: 'books',
    singularDisplayName: 'book',
    table: 'books',
    fields: {
      title: {
        type: 'STRING',
        name: 'Title',
        menuKey: true, //must be the only field with menuKey
        displayOrder: 1,
      },
      category_id: {
        type: 'CUSTOM',
        name: 'Category',
        custom: true,
        displayOrder: 2,
      },
      content: {
        type: 'LONG_STRING',
        name: 'Content',
        custom: true,
        displayOrder: 3,
      },
      category_name: {
        type: 'NO_DISPLAY',
        name: 'Category Name',
        omit: true,
      }
    },
    overrideGetSql: 'SELECT books.id, books.title, books.content, books.category_id, book_categories.name AS category_name FROM books LEFT JOIN book_categories ON books.category_id = book_categories.id;',
  },
  bookCategories: {
    path: '/bookCategories',
    name: 'book categories',
    singularDisplayName: 'book category',
    table: 'book_categories',
    fields: {
      name: {},
      color: {},
    },
  },
  servers: {
    path: '/servers',
    name: 'servers',
    singularDisplayName: 'server',
    table: 'servers',
    fields: {
      name: {},
      url: {},
      port: {},
      access_level: {},
    },
  },
  config: {
    path: '/config',
    name: 'config',
    singularDisplayName: 'config',
    table: 'config',
    fields: {
      cfg_key: {},
      cfg_value: {},
    },
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
    fields: {
      name: {
        type: 'STRING',
        name: 'Name',
        menuKey: true, //must be the only field with menuKey
        displayOrder: 1,
      },
      description: {
        type: 'STRING',
        name: 'Description',
        displayOrder: 2,
      },
    },
  },
  users: {
    path: '/users',
    name: 'users',
    singularDisplayName: 'user',
    table: 'users',
    fields: {
      nickname: {
        name: 'Nickname',
        type: 'STRING',
        menuKey: true, //must be the only field with menuKey
        displayOrder: 1,
      },
      email: {
        name: 'Email',
        type: 'STRING',
        displayOrder: 2,
      },
      byond_key: {
        name: 'Byond Key',
        type: 'STRING',
        displayOrder: 3,
      },
      permissions: {
        type: 'CUSTOM',
        name: 'Permissions:',
        custom: true,
        omit: true,
        displayOrder: 4,
      }
    },
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