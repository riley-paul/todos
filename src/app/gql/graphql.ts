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

export type ListObjectType = {
  __typename?: 'ListObjectType';
  id: Scalars['ID']['output'];
  listUser: ListUserObjectType;
  name: Scalars['String']['output'];
  todoCount: Scalars['Int']['output'];
  todos: Array<TodoObjectType>;
};

export type ListUserObjectType = {
  __typename?: 'ListUserObjectType';
  isPending: Scalars['Boolean']['output'];
  listId: Scalars['ID']['output'];
  show: Scalars['Boolean']['output'];
  userId: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  lists: Array<ListObjectType>;
  todos: Array<TodoObjectType>;
};


export type QueryTodosArgs = {
  listId?: InputMaybe<Scalars['ID']['input']>;
};

export type TodoObjectType = {
  __typename?: 'TodoObjectType';
  author: UserObjectType;
  id: Scalars['ID']['output'];
  isAuthor: Scalars['Boolean']['output'];
  isCompleted: Scalars['Boolean']['output'];
  list: ListObjectType;
  text: Scalars['String']['output'];
};

export type UserObjectType = {
  __typename?: 'UserObjectType';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type GetListsForChipsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetListsForChipsQuery = { __typename?: 'Query', lists: Array<{ __typename?: 'ListObjectType', id: string, name: string, todoCount: number, listUser: { __typename?: 'ListUserObjectType', show: boolean } }> };


export const GetListsForChipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetListsForChips"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"todoCount"}},{"kind":"Field","name":{"kind":"Name","value":"listUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"show"}}]}}]}}]}}]} as unknown as DocumentNode<GetListsForChipsQuery, GetListsForChipsQueryVariables>;