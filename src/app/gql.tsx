import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
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
  isPending: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  otherUsers: Array<UserObjectType>;
  show: Scalars['Boolean']['output'];
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

export type ListChipFragment = { __typename?: 'ListObjectType', id: string, name: string, todoCount: number, show: boolean, isPending: boolean, otherUsers: Array<{ __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }> };

export type GetListsForChipsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetListsForChipsQuery = { __typename?: 'Query', lists: Array<{ __typename?: 'ListObjectType', id: string, name: string, todoCount: number, show: boolean, isPending: boolean, otherUsers: Array<{ __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }> }> };

export type TodoFragment = { __typename?: 'TodoObjectType', id: string, text: string, isCompleted: boolean, isAuthor: boolean, author: { __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }, list: { __typename?: 'ListObjectType', id: string, name: string } };

export type GetTodosQueryVariables = Exact<{
  listId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetTodosQuery = { __typename?: 'Query', todos: Array<{ __typename?: 'TodoObjectType', id: string, text: string, isCompleted: boolean, isAuthor: boolean, author: { __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }, list: { __typename?: 'ListObjectType', id: string, name: string } }> };

export type UserFragment = { __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null };

export const UserFragmentDoc = gql`
    fragment User on UserObjectType {
  id
  name
  email
  avatarUrl
}
    `;
export const ListChipFragmentDoc = gql`
    fragment ListChip on ListObjectType {
  id
  name
  todoCount
  show
  isPending
  otherUsers {
    ...User
  }
}
    ${UserFragmentDoc}`;
export const TodoFragmentDoc = gql`
    fragment Todo on TodoObjectType {
  id
  text
  isCompleted
  isAuthor
  author {
    ...User
  }
  list {
    id
    name
  }
}
    ${UserFragmentDoc}`;
export const GetListsForChipsDocument = gql`
    query GetListsForChips {
  lists {
    ...ListChip
  }
}
    ${ListChipFragmentDoc}`;

/**
 * __useGetListsForChipsQuery__
 *
 * To run a query within a React component, call `useGetListsForChipsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetListsForChipsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetListsForChipsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetListsForChipsQuery(baseOptions?: Apollo.QueryHookOptions<GetListsForChipsQuery, GetListsForChipsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetListsForChipsQuery, GetListsForChipsQueryVariables>(GetListsForChipsDocument, options);
      }
export function useGetListsForChipsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetListsForChipsQuery, GetListsForChipsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetListsForChipsQuery, GetListsForChipsQueryVariables>(GetListsForChipsDocument, options);
        }
// @ts-ignore
export function useGetListsForChipsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetListsForChipsQuery, GetListsForChipsQueryVariables>): Apollo.UseSuspenseQueryResult<GetListsForChipsQuery, GetListsForChipsQueryVariables>;
export function useGetListsForChipsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetListsForChipsQuery, GetListsForChipsQueryVariables>): Apollo.UseSuspenseQueryResult<GetListsForChipsQuery | undefined, GetListsForChipsQueryVariables>;
export function useGetListsForChipsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetListsForChipsQuery, GetListsForChipsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetListsForChipsQuery, GetListsForChipsQueryVariables>(GetListsForChipsDocument, options);
        }
export type GetListsForChipsQueryHookResult = ReturnType<typeof useGetListsForChipsQuery>;
export type GetListsForChipsLazyQueryHookResult = ReturnType<typeof useGetListsForChipsLazyQuery>;
export type GetListsForChipsSuspenseQueryHookResult = ReturnType<typeof useGetListsForChipsSuspenseQuery>;
export type GetListsForChipsQueryResult = Apollo.QueryResult<GetListsForChipsQuery, GetListsForChipsQueryVariables>;
export const GetTodosDocument = gql`
    query GetTodos($listId: ID) {
  todos(listId: $listId) {
    ...Todo
  }
}
    ${TodoFragmentDoc}`;

/**
 * __useGetTodosQuery__
 *
 * To run a query within a React component, call `useGetTodosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTodosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTodosQuery({
 *   variables: {
 *      listId: // value for 'listId'
 *   },
 * });
 */
export function useGetTodosQuery(baseOptions?: Apollo.QueryHookOptions<GetTodosQuery, GetTodosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTodosQuery, GetTodosQueryVariables>(GetTodosDocument, options);
      }
export function useGetTodosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTodosQuery, GetTodosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTodosQuery, GetTodosQueryVariables>(GetTodosDocument, options);
        }
// @ts-ignore
export function useGetTodosSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTodosQuery, GetTodosQueryVariables>): Apollo.UseSuspenseQueryResult<GetTodosQuery, GetTodosQueryVariables>;
export function useGetTodosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTodosQuery, GetTodosQueryVariables>): Apollo.UseSuspenseQueryResult<GetTodosQuery | undefined, GetTodosQueryVariables>;
export function useGetTodosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTodosQuery, GetTodosQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTodosQuery, GetTodosQueryVariables>(GetTodosDocument, options);
        }
export type GetTodosQueryHookResult = ReturnType<typeof useGetTodosQuery>;
export type GetTodosLazyQueryHookResult = ReturnType<typeof useGetTodosLazyQuery>;
export type GetTodosSuspenseQueryHookResult = ReturnType<typeof useGetTodosSuspenseQuery>;
export type GetTodosQueryResult = Apollo.QueryResult<GetTodosQuery, GetTodosQueryVariables>;