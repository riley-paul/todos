/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as WithBackImport } from './routes/_withBack'
import { Route as WithAdderImport } from './routes/_withAdder'
import { Route as WithAdderIndexImport } from './routes/_withAdder.index'
import { Route as WithBackTodosNewImport } from './routes/_withBack.todos.new'
import { Route as WithAdderTodosListIdImport } from './routes/_withAdder.todos.$listId'
import { Route as WithBackTodosListIdEditImport } from './routes/_withBack.todos.$listId.edit'

// Create/Update Routes

const WithBackRoute = WithBackImport.update({
  id: '/_withBack',
  getParentRoute: () => rootRoute,
} as any)

const WithAdderRoute = WithAdderImport.update({
  id: '/_withAdder',
  getParentRoute: () => rootRoute,
} as any)

const WithAdderIndexRoute = WithAdderIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => WithAdderRoute,
} as any)

const WithBackTodosNewRoute = WithBackTodosNewImport.update({
  id: '/todos/new',
  path: '/todos/new',
  getParentRoute: () => WithBackRoute,
} as any)

const WithAdderTodosListIdRoute = WithAdderTodosListIdImport.update({
  id: '/todos/$listId',
  path: '/todos/$listId',
  getParentRoute: () => WithAdderRoute,
} as any)

const WithBackTodosListIdEditRoute = WithBackTodosListIdEditImport.update({
  id: '/todos/$listId/edit',
  path: '/todos/$listId/edit',
  getParentRoute: () => WithBackRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_withAdder': {
      id: '/_withAdder'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof WithAdderImport
      parentRoute: typeof rootRoute
    }
    '/_withBack': {
      id: '/_withBack'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof WithBackImport
      parentRoute: typeof rootRoute
    }
    '/_withAdder/': {
      id: '/_withAdder/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof WithAdderIndexImport
      parentRoute: typeof WithAdderImport
    }
    '/_withAdder/todos/$listId': {
      id: '/_withAdder/todos/$listId'
      path: '/todos/$listId'
      fullPath: '/todos/$listId'
      preLoaderRoute: typeof WithAdderTodosListIdImport
      parentRoute: typeof WithAdderImport
    }
    '/_withBack/todos/new': {
      id: '/_withBack/todos/new'
      path: '/todos/new'
      fullPath: '/todos/new'
      preLoaderRoute: typeof WithBackTodosNewImport
      parentRoute: typeof WithBackImport
    }
    '/_withBack/todos/$listId/edit': {
      id: '/_withBack/todos/$listId/edit'
      path: '/todos/$listId/edit'
      fullPath: '/todos/$listId/edit'
      preLoaderRoute: typeof WithBackTodosListIdEditImport
      parentRoute: typeof WithBackImport
    }
  }
}

// Create and export the route tree

interface WithAdderRouteChildren {
  WithAdderIndexRoute: typeof WithAdderIndexRoute
  WithAdderTodosListIdRoute: typeof WithAdderTodosListIdRoute
}

const WithAdderRouteChildren: WithAdderRouteChildren = {
  WithAdderIndexRoute: WithAdderIndexRoute,
  WithAdderTodosListIdRoute: WithAdderTodosListIdRoute,
}

const WithAdderRouteWithChildren = WithAdderRoute._addFileChildren(
  WithAdderRouteChildren,
)

interface WithBackRouteChildren {
  WithBackTodosNewRoute: typeof WithBackTodosNewRoute
  WithBackTodosListIdEditRoute: typeof WithBackTodosListIdEditRoute
}

const WithBackRouteChildren: WithBackRouteChildren = {
  WithBackTodosNewRoute: WithBackTodosNewRoute,
  WithBackTodosListIdEditRoute: WithBackTodosListIdEditRoute,
}

const WithBackRouteWithChildren = WithBackRoute._addFileChildren(
  WithBackRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof WithBackRouteWithChildren
  '/': typeof WithAdderIndexRoute
  '/todos/$listId': typeof WithAdderTodosListIdRoute
  '/todos/new': typeof WithBackTodosNewRoute
  '/todos/$listId/edit': typeof WithBackTodosListIdEditRoute
}

export interface FileRoutesByTo {
  '': typeof WithBackRouteWithChildren
  '/': typeof WithAdderIndexRoute
  '/todos/$listId': typeof WithAdderTodosListIdRoute
  '/todos/new': typeof WithBackTodosNewRoute
  '/todos/$listId/edit': typeof WithBackTodosListIdEditRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_withAdder': typeof WithAdderRouteWithChildren
  '/_withBack': typeof WithBackRouteWithChildren
  '/_withAdder/': typeof WithAdderIndexRoute
  '/_withAdder/todos/$listId': typeof WithAdderTodosListIdRoute
  '/_withBack/todos/new': typeof WithBackTodosNewRoute
  '/_withBack/todos/$listId/edit': typeof WithBackTodosListIdEditRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/' | '/todos/$listId' | '/todos/new' | '/todos/$listId/edit'
  fileRoutesByTo: FileRoutesByTo
  to: '' | '/' | '/todos/$listId' | '/todos/new' | '/todos/$listId/edit'
  id:
    | '__root__'
    | '/_withAdder'
    | '/_withBack'
    | '/_withAdder/'
    | '/_withAdder/todos/$listId'
    | '/_withBack/todos/new'
    | '/_withBack/todos/$listId/edit'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  WithAdderRoute: typeof WithAdderRouteWithChildren
  WithBackRoute: typeof WithBackRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  WithAdderRoute: WithAdderRouteWithChildren,
  WithBackRoute: WithBackRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_withAdder",
        "/_withBack"
      ]
    },
    "/_withAdder": {
      "filePath": "_withAdder.tsx",
      "children": [
        "/_withAdder/",
        "/_withAdder/todos/$listId"
      ]
    },
    "/_withBack": {
      "filePath": "_withBack.tsx",
      "children": [
        "/_withBack/todos/new",
        "/_withBack/todos/$listId/edit"
      ]
    },
    "/_withAdder/": {
      "filePath": "_withAdder.index.tsx",
      "parent": "/_withAdder"
    },
    "/_withAdder/todos/$listId": {
      "filePath": "_withAdder.todos.$listId.tsx",
      "parent": "/_withAdder"
    },
    "/_withBack/todos/new": {
      "filePath": "_withBack.todos.new.tsx",
      "parent": "/_withBack"
    },
    "/_withBack/todos/$listId/edit": {
      "filePath": "_withBack.todos.$listId.edit.tsx",
      "parent": "/_withBack"
    }
  }
}
ROUTE_MANIFEST_END */
