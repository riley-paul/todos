/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type List = {
  __typename?: 'List';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  todoCount: Scalars['Int']['output'];
  todos?: Maybe<Array<Todo>>;
};

export type Query = {
  __typename?: 'Query';
  lists?: Maybe<Array<List>>;
  todos?: Maybe<Array<Todo>>;
};


export type QueryTodosArgs = {
  listId?: InputMaybe<Scalars['ID']['input']>;
};

export type Todo = {
  __typename?: 'Todo';
  author?: Maybe<User>;
  id?: Maybe<Scalars['ID']['output']>;
  isAuthor?: Maybe<Scalars['Boolean']['output']>;
  isCompleted?: Maybe<Scalars['Boolean']['output']>;
  list?: Maybe<List>;
  text?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type GetListsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetListsQuery = { __typename?: 'Query', lists?: Array<{ __typename?: 'List', id?: string | null, name?: string | null }> | null };


export const GetListsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetListsQuery, GetListsQueryVariables>;