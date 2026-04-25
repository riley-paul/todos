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

export type CreateTodoInput = {
  listId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
};

export type DeleteTodoInput = {
  id: Scalars['ID']['input'];
};

export type ListObjectType = {
  __typename?: 'ListObjectType';
  id: Scalars['ID']['output'];
  isPending: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
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

export type Mutation = {
  __typename?: 'Mutation';
  createTodo?: Maybe<ListObjectType>;
  deleteCompletedTodos?: Maybe<ListObjectType>;
  deleteTodo?: Maybe<Scalars['Boolean']['output']>;
  uncheckCompletedTodos?: Maybe<ListObjectType>;
  updateTodo?: Maybe<TodoObjectType>;
};


export type MutationCreateTodoArgs = {
  input: CreateTodoInput;
};


export type MutationDeleteCompletedTodosArgs = {
  listId: Scalars['ID']['input'];
};


export type MutationDeleteTodoArgs = {
  input: DeleteTodoInput;
};


export type MutationUncheckCompletedTodosArgs = {
  listId: Scalars['ID']['input'];
};


export type MutationUpdateTodoArgs = {
  input: UpdateTodoInput;
};

export type Query = {
  __typename?: 'Query';
  list?: Maybe<ListObjectType>;
  lists: Array<ListObjectType>;
  me: UserObjectType;
  todos: Array<TodoObjectType>;
};


export type QueryListArgs = {
  listId: Scalars['ID']['input'];
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

export type UpdateTodoInput = {
  id: Scalars['ID']['input'];
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  listId?: InputMaybe<Scalars['ID']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type UserObjectType = {
  __typename?: 'UserObjectType';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  settingGroupCompleted: Scalars['Boolean']['output'];
};

export type ShallowListFragment = { __typename?: 'ListObjectType', id: string, name: string, todoCount: number, show: boolean, order: number, isPending: boolean, otherUsers: Array<{ __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }> };

export type ListFullFragment = { __typename?: 'ListObjectType', id: string, name: string, todoCount: number, show: boolean, order: number, isPending: boolean, todos: Array<{ __typename?: 'TodoObjectType', id: string, text: string, isCompleted: boolean, isAuthor: boolean, author: { __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }, list: { __typename?: 'ListObjectType', id: string, name: string } }>, otherUsers: Array<{ __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }> };

export type GetListsForChipsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetListsForChipsQuery = { __typename?: 'Query', lists: Array<{ __typename?: 'ListObjectType', id: string, name: string, todoCount: number, show: boolean, order: number, isPending: boolean, otherUsers: Array<{ __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }> }> };

export type GetListQueryVariables = Exact<{
  listId: Scalars['ID']['input'];
}>;


export type GetListQuery = { __typename?: 'Query', list?: { __typename?: 'ListObjectType', id: string, name: string, todoCount: number, show: boolean, order: number, isPending: boolean, todos: Array<{ __typename?: 'TodoObjectType', id: string, text: string, isCompleted: boolean, isAuthor: boolean, author: { __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }, list: { __typename?: 'ListObjectType', id: string, name: string } }>, otherUsers: Array<{ __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }> } | null };

export type TodoFragment = { __typename?: 'TodoObjectType', id: string, text: string, isCompleted: boolean, isAuthor: boolean, author: { __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }, list: { __typename?: 'ListObjectType', id: string, name: string } };

export type GetTodosQueryVariables = Exact<{
  listId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetTodosQuery = { __typename?: 'Query', todos: Array<{ __typename?: 'TodoObjectType', id: string, text: string, isCompleted: boolean, isAuthor: boolean, author: { __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }, list: { __typename?: 'ListObjectType', id: string, name: string } }> };

export type CreateTodoMutationVariables = Exact<{
  input: CreateTodoInput;
}>;


export type CreateTodoMutation = { __typename?: 'Mutation', createTodo?: { __typename?: 'ListObjectType', id: string, name: string, todoCount: number, show: boolean, order: number, isPending: boolean, todos: Array<{ __typename?: 'TodoObjectType', id: string, text: string, isCompleted: boolean, isAuthor: boolean, author: { __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }, list: { __typename?: 'ListObjectType', id: string, name: string } }>, otherUsers: Array<{ __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }> } | null };

export type DeleteTodoMutationVariables = Exact<{
  input: DeleteTodoInput;
}>;


export type DeleteTodoMutation = { __typename?: 'Mutation', deleteTodo?: boolean | null };

export type UpdateTodoMutationVariables = Exact<{
  input: UpdateTodoInput;
}>;


export type UpdateTodoMutation = { __typename?: 'Mutation', updateTodo?: { __typename?: 'TodoObjectType', id: string, text: string, isCompleted: boolean, isAuthor: boolean, author: { __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }, list: { __typename?: 'ListObjectType', id: string, name: string } } | null };

export type DeleteCompletedTodosMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
}>;


export type DeleteCompletedTodosMutation = { __typename?: 'Mutation', deleteCompletedTodos?: { __typename?: 'ListObjectType', id: string, name: string, todoCount: number, show: boolean, order: number, isPending: boolean, todos: Array<{ __typename?: 'TodoObjectType', id: string, text: string, isCompleted: boolean, isAuthor: boolean, author: { __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }, list: { __typename?: 'ListObjectType', id: string, name: string } }>, otherUsers: Array<{ __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }> } | null };

export type UncheckCompletedTodosMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
}>;


export type UncheckCompletedTodosMutation = { __typename?: 'Mutation', uncheckCompletedTodos?: { __typename?: 'ListObjectType', id: string, name: string, todoCount: number, show: boolean, order: number, isPending: boolean, todos: Array<{ __typename?: 'TodoObjectType', id: string, text: string, isCompleted: boolean, isAuthor: boolean, author: { __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }, list: { __typename?: 'ListObjectType', id: string, name: string } }>, otherUsers: Array<{ __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null }> } | null };

export type UserFragment = { __typename?: 'UserObjectType', id: string, name: string, email: string, avatarUrl?: string | null };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'UserObjectType', settingGroupCompleted: boolean, id: string, name: string, email: string, avatarUrl?: string | null } };

export const UserFragmentDoc = gql`
    fragment User on UserObjectType {
  id
  name
  email
  avatarUrl
}
    `;
export const ShallowListFragmentDoc = gql`
    fragment ShallowList on ListObjectType {
  id
  name
  todoCount
  show
  order
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
export const ListFullFragmentDoc = gql`
    fragment ListFull on ListObjectType {
  ...ShallowList
  todos {
    ...Todo
  }
}
    ${ShallowListFragmentDoc}
${TodoFragmentDoc}`;
export const GetListsForChipsDocument = gql`
    query GetListsForChips {
  lists {
    ...ShallowList
  }
}
    ${ShallowListFragmentDoc}`;

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
export const GetListDocument = gql`
    query GetList($listId: ID!) {
  list(listId: $listId) {
    ...ListFull
  }
}
    ${ListFullFragmentDoc}`;

/**
 * __useGetListQuery__
 *
 * To run a query within a React component, call `useGetListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetListQuery({
 *   variables: {
 *      listId: // value for 'listId'
 *   },
 * });
 */
export function useGetListQuery(baseOptions: Apollo.QueryHookOptions<GetListQuery, GetListQueryVariables> & ({ variables: GetListQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetListQuery, GetListQueryVariables>(GetListDocument, options);
      }
export function useGetListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetListQuery, GetListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetListQuery, GetListQueryVariables>(GetListDocument, options);
        }
// @ts-ignore
export function useGetListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetListQuery, GetListQueryVariables>): Apollo.UseSuspenseQueryResult<GetListQuery, GetListQueryVariables>;
export function useGetListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetListQuery, GetListQueryVariables>): Apollo.UseSuspenseQueryResult<GetListQuery | undefined, GetListQueryVariables>;
export function useGetListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetListQuery, GetListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetListQuery, GetListQueryVariables>(GetListDocument, options);
        }
export type GetListQueryHookResult = ReturnType<typeof useGetListQuery>;
export type GetListLazyQueryHookResult = ReturnType<typeof useGetListLazyQuery>;
export type GetListSuspenseQueryHookResult = ReturnType<typeof useGetListSuspenseQuery>;
export type GetListQueryResult = Apollo.QueryResult<GetListQuery, GetListQueryVariables>;
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
export const CreateTodoDocument = gql`
    mutation CreateTodo($input: CreateTodoInput!) {
  createTodo(input: $input) {
    ...ListFull
  }
}
    ${ListFullFragmentDoc}`;
export type CreateTodoMutationFn = Apollo.MutationFunction<CreateTodoMutation, CreateTodoMutationVariables>;

/**
 * __useCreateTodoMutation__
 *
 * To run a mutation, you first call `useCreateTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTodoMutation, { data, loading, error }] = useCreateTodoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTodoMutation(baseOptions?: Apollo.MutationHookOptions<CreateTodoMutation, CreateTodoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTodoMutation, CreateTodoMutationVariables>(CreateTodoDocument, options);
      }
export type CreateTodoMutationHookResult = ReturnType<typeof useCreateTodoMutation>;
export type CreateTodoMutationResult = Apollo.MutationResult<CreateTodoMutation>;
export type CreateTodoMutationOptions = Apollo.BaseMutationOptions<CreateTodoMutation, CreateTodoMutationVariables>;
export const DeleteTodoDocument = gql`
    mutation DeleteTodo($input: DeleteTodoInput!) {
  deleteTodo(input: $input)
}
    `;
export type DeleteTodoMutationFn = Apollo.MutationFunction<DeleteTodoMutation, DeleteTodoMutationVariables>;

/**
 * __useDeleteTodoMutation__
 *
 * To run a mutation, you first call `useDeleteTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTodoMutation, { data, loading, error }] = useDeleteTodoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteTodoMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTodoMutation, DeleteTodoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTodoMutation, DeleteTodoMutationVariables>(DeleteTodoDocument, options);
      }
export type DeleteTodoMutationHookResult = ReturnType<typeof useDeleteTodoMutation>;
export type DeleteTodoMutationResult = Apollo.MutationResult<DeleteTodoMutation>;
export type DeleteTodoMutationOptions = Apollo.BaseMutationOptions<DeleteTodoMutation, DeleteTodoMutationVariables>;
export const UpdateTodoDocument = gql`
    mutation UpdateTodo($input: UpdateTodoInput!) {
  updateTodo(input: $input) {
    ...Todo
  }
}
    ${TodoFragmentDoc}`;
export type UpdateTodoMutationFn = Apollo.MutationFunction<UpdateTodoMutation, UpdateTodoMutationVariables>;

/**
 * __useUpdateTodoMutation__
 *
 * To run a mutation, you first call `useUpdateTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTodoMutation, { data, loading, error }] = useUpdateTodoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTodoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTodoMutation, UpdateTodoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTodoMutation, UpdateTodoMutationVariables>(UpdateTodoDocument, options);
      }
export type UpdateTodoMutationHookResult = ReturnType<typeof useUpdateTodoMutation>;
export type UpdateTodoMutationResult = Apollo.MutationResult<UpdateTodoMutation>;
export type UpdateTodoMutationOptions = Apollo.BaseMutationOptions<UpdateTodoMutation, UpdateTodoMutationVariables>;
export const DeleteCompletedTodosDocument = gql`
    mutation DeleteCompletedTodos($listId: ID!) {
  deleteCompletedTodos(listId: $listId) {
    ...ListFull
  }
}
    ${ListFullFragmentDoc}`;
export type DeleteCompletedTodosMutationFn = Apollo.MutationFunction<DeleteCompletedTodosMutation, DeleteCompletedTodosMutationVariables>;

/**
 * __useDeleteCompletedTodosMutation__
 *
 * To run a mutation, you first call `useDeleteCompletedTodosMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCompletedTodosMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCompletedTodosMutation, { data, loading, error }] = useDeleteCompletedTodosMutation({
 *   variables: {
 *      listId: // value for 'listId'
 *   },
 * });
 */
export function useDeleteCompletedTodosMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCompletedTodosMutation, DeleteCompletedTodosMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCompletedTodosMutation, DeleteCompletedTodosMutationVariables>(DeleteCompletedTodosDocument, options);
      }
export type DeleteCompletedTodosMutationHookResult = ReturnType<typeof useDeleteCompletedTodosMutation>;
export type DeleteCompletedTodosMutationResult = Apollo.MutationResult<DeleteCompletedTodosMutation>;
export type DeleteCompletedTodosMutationOptions = Apollo.BaseMutationOptions<DeleteCompletedTodosMutation, DeleteCompletedTodosMutationVariables>;
export const UncheckCompletedTodosDocument = gql`
    mutation UncheckCompletedTodos($listId: ID!) {
  uncheckCompletedTodos(listId: $listId) {
    ...ListFull
  }
}
    ${ListFullFragmentDoc}`;
export type UncheckCompletedTodosMutationFn = Apollo.MutationFunction<UncheckCompletedTodosMutation, UncheckCompletedTodosMutationVariables>;

/**
 * __useUncheckCompletedTodosMutation__
 *
 * To run a mutation, you first call `useUncheckCompletedTodosMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUncheckCompletedTodosMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uncheckCompletedTodosMutation, { data, loading, error }] = useUncheckCompletedTodosMutation({
 *   variables: {
 *      listId: // value for 'listId'
 *   },
 * });
 */
export function useUncheckCompletedTodosMutation(baseOptions?: Apollo.MutationHookOptions<UncheckCompletedTodosMutation, UncheckCompletedTodosMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UncheckCompletedTodosMutation, UncheckCompletedTodosMutationVariables>(UncheckCompletedTodosDocument, options);
      }
export type UncheckCompletedTodosMutationHookResult = ReturnType<typeof useUncheckCompletedTodosMutation>;
export type UncheckCompletedTodosMutationResult = Apollo.MutationResult<UncheckCompletedTodosMutation>;
export type UncheckCompletedTodosMutationOptions = Apollo.BaseMutationOptions<UncheckCompletedTodosMutation, UncheckCompletedTodosMutationVariables>;
export const GetMeDocument = gql`
    query GetMe {
  me {
    ...User
    settingGroupCompleted
  }
}
    ${UserFragmentDoc}`;

/**
 * __useGetMeQuery__
 *
 * To run a query within a React component, call `useGetMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMeQuery(baseOptions?: Apollo.QueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
      }
export function useGetMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
// @ts-ignore
export function useGetMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMeQuery, GetMeQueryVariables>): Apollo.UseSuspenseQueryResult<GetMeQuery, GetMeQueryVariables>;
export function useGetMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMeQuery, GetMeQueryVariables>): Apollo.UseSuspenseQueryResult<GetMeQuery | undefined, GetMeQueryVariables>;
export function useGetMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
export type GetMeQueryHookResult = ReturnType<typeof useGetMeQuery>;
export type GetMeLazyQueryHookResult = ReturnType<typeof useGetMeLazyQuery>;
export type GetMeSuspenseQueryHookResult = ReturnType<typeof useGetMeSuspenseQuery>;
export type GetMeQueryResult = Apollo.QueryResult<GetMeQuery, GetMeQueryVariables>;