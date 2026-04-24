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


export type GetListsForChipsQuery = { __typename?: 'Query', lists: Array<{ __typename?: 'ListObjectType', id: string, name: string, todoCount: number, listUser: { __typename?: 'ListUserObjectType', show: boolean, isPending: boolean } }> };


export const GetListsForChipsDocument = gql`
    query GetListsForChips {
  lists {
    id
    name
    todoCount
    listUser {
      show
      isPending
    }
  }
}
    `;

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