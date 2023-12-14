/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

function fetcher<TData, TVariables>(endpoint: string, requestInit: RequestInit, query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Answer = {
  __typename?: 'Answer';
  answer?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Float']['output']>;
  endTime?: Maybe<Scalars['Float']['output']>;
  isCorrect?: Maybe<Scalars['Boolean']['output']>;
  numOfSubmission?: Maybe<Scalars['Float']['output']>;
  questionId: Scalars['String']['output'];
  startTime?: Maybe<Scalars['Float']['output']>;
};

export type AnswerMutationRequest = {
  answer?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Float']['input']>;
  endTime?: InputMaybe<Scalars['Float']['input']>;
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
  questionId: Scalars['String']['input'];
  startTime?: InputMaybe<Scalars['Float']['input']>;
};

export type Card = {
  __typename?: 'Card';
  _id: Scalars['String']['output'];
  code: Scalars['String']['output'];
  isRedeemed?: Maybe<Scalars['Boolean']['output']>;
  key: Scalars['String']['output'];
};

export type CardVerifyRequest = {
  code: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: Token;
  submitAnswer: Answer;
};


export type MutationLoginArgs = {
  input: CardVerifyRequest;
};


export type MutationSubmitAnswerArgs = {
  input: AnswerMutationRequest;
};

export type Query = {
  __typename?: 'Query';
  answer?: Maybe<Answer>;
  answers?: Maybe<Array<Answer>>;
  generateCards: Array<Card>;
};


export type QueryAnswerArgs = {
  questionId: Scalars['String']['input'];
};


export type QueryAnswersArgs = {
  questionId: Scalars['String']['input'];
};


export type QueryGenerateCardsArgs = {
  size: Scalars['Float']['input'];
};

export type Token = {
  __typename?: 'Token';
  accessToken: Scalars['String']['output'];
};

export type AnswerQueryVariables = Exact<{
  questionId: Scalars['String']['input'];
}>;


export type AnswerQuery = { __typename?: 'Query', answer?: { __typename?: 'Answer', answer?: string | null, startTime?: number | null, endTime?: number | null, numOfSubmission?: number | null, duration?: number | null } | null };

export type AnswersQueryVariables = Exact<{
  questionId: Scalars['String']['input'];
}>;


export type AnswersQuery = { __typename?: 'Query', answers?: Array<{ __typename?: 'Answer', questionId: string }> | null };

export type LoginMutationVariables = Exact<{
  input: CardVerifyRequest;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Token', accessToken: string } };

export type SubmitAnswerMutationVariables = Exact<{
  input: AnswerMutationRequest;
}>;


export type SubmitAnswerMutation = { __typename?: 'Mutation', submitAnswer: { __typename?: 'Answer', questionId: string, numOfSubmission?: number | null, isCorrect?: boolean | null, startTime?: number | null, endTime?: number | null, duration?: number | null } };


export const AnswerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"answer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"questionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"numOfSubmission"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<AnswerQuery, AnswerQueryVariables>;
export const AnswersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"answers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"questionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questionId"}}]}}]}}]} as unknown as DocumentNode<AnswersQuery, AnswersQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CardVerifyRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const SubmitAnswerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"submitAnswer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerMutationRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitAnswer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questionId"}},{"kind":"Field","name":{"kind":"Name","value":"numOfSubmission"}},{"kind":"Field","name":{"kind":"Name","value":"isCorrect"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<SubmitAnswerMutation, SubmitAnswerMutationVariables>;

export const IanswerDocument = `
    query answer($questionId: String!) {
  answer(questionId: $questionId) {
    answer
    startTime
    endTime
    numOfSubmission
    duration
  }
}
    `;
export const useAnswerQuery = <
      TData = AnswerQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: AnswerQueryVariables,
      options?: UseQueryOptions<AnswerQuery, TError, TData>
    ) =>
    useQuery<AnswerQuery, TError, TData>(
      ['answer', variables],
      fetcher<AnswerQuery, AnswerQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, IanswerDocument, variables),
      options
    );
export const IanswersDocument = `
    query answers($questionId: String!) {
  answers(questionId: $questionId) {
    questionId
  }
}
    `;
export const useAnswersQuery = <
      TData = AnswersQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: AnswersQueryVariables,
      options?: UseQueryOptions<AnswersQuery, TError, TData>
    ) =>
    useQuery<AnswersQuery, TError, TData>(
      ['answers', variables],
      fetcher<AnswersQuery, AnswersQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, IanswersDocument, variables),
      options
    );
export const IloginDocument = `
    mutation login($input: CardVerifyRequest!) {
  login(input: $input) {
    accessToken
  }
}
    `;
export const useLoginMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<LoginMutation, TError, LoginMutationVariables, TContext>
    ) =>
    useMutation<LoginMutation, TError, LoginMutationVariables, TContext>(
      ['login'],
      (variables?: LoginMutationVariables) => fetcher<LoginMutation, LoginMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, IloginDocument, variables)(),
      options
    );
export const IsubmitAnswerDocument = `
    mutation submitAnswer($input: AnswerMutationRequest!) {
  submitAnswer(input: $input) {
    questionId
    numOfSubmission
    isCorrect
    startTime
    endTime
    duration
  }
}
    `;
export const useSubmitAnswerMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<SubmitAnswerMutation, TError, SubmitAnswerMutationVariables, TContext>
    ) =>
    useMutation<SubmitAnswerMutation, TError, SubmitAnswerMutationVariables, TContext>(
      ['submitAnswer'],
      (variables?: SubmitAnswerMutationVariables) => fetcher<SubmitAnswerMutation, SubmitAnswerMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, IsubmitAnswerDocument, variables)(),
      options
    );