/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
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
  answer: Scalars['String']['output'];
  isCorrect?: Maybe<Scalars['Boolean']['output']>;
  numOfSubmission?: Maybe<Scalars['Float']['output']>;
  questionId: Scalars['String']['output'];
  time?: Maybe<Scalars['Float']['output']>;
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
  input: SubmissionMutationRequest;
};

export type Option = {
  __typename?: 'Option';
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  generateCards: Array<Card>;
  question: Question;
  questions: Array<Question>;
};


export type QueryGenerateCardsArgs = {
  size: Scalars['Float']['input'];
};


export type QueryQuestionArgs = {
  id: Scalars['String']['input'];
};


export type QueryQuestionsArgs = {
  category2?: InputMaybe<Scalars['String']['input']>;
  category3?: InputMaybe<Scalars['String']['input']>;
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
};

export type Question = {
  __typename?: 'Question';
  _id: Scalars['String']['output'];
  answer: Scalars['String']['output'];
  category1?: Maybe<Scalars['String']['output']>;
  category2?: Maybe<Scalars['String']['output']>;
  category3?: Maybe<Scalars['String']['output']>;
  category4?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  fileUrl?: Maybe<Scalars['String']['output']>;
  isTest?: Maybe<Scalars['Boolean']['output']>;
  label: Scalars['String']['output'];
  options?: Maybe<Array<Option>>;
  type?: Maybe<Scalars['String']['output']>;
};

export type SubmissionMutationRequest = {
  answer: Scalars['String']['input'];
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
  questionId: Scalars['String']['input'];
  time?: InputMaybe<Scalars['Float']['input']>;
};

export type Token = {
  __typename?: 'Token';
  accessToken: Scalars['String']['output'];
};

export type LoginMutationVariables = Exact<{
  input: CardVerifyRequest;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Token', accessToken: string } };

export type QuestionQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type QuestionQuery = { __typename?: 'Query', question: { __typename?: 'Question', _id: string, category1?: string | null, category2?: string | null, category3?: string | null, category4?: string | null, label: string, description?: string | null, fileUrl?: string | null, answer: string, type?: string | null, isTest?: boolean | null, options?: Array<{ __typename?: 'Option', value: string, label: string }> | null } };

export type SubmitAnswerMutationVariables = Exact<{
  input: SubmissionMutationRequest;
}>;


export type SubmitAnswerMutation = { __typename?: 'Mutation', submitAnswer: { __typename?: 'Answer', questionId: string, numOfSubmission?: number | null } };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CardVerifyRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const QuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"question"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"category1"}},{"kind":"Field","name":{"kind":"Name","value":"category2"}},{"kind":"Field","name":{"kind":"Name","value":"category3"}},{"kind":"Field","name":{"kind":"Name","value":"category4"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"fileUrl"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isTest"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}}]}}]} as unknown as DocumentNode<QuestionQuery, QuestionQueryVariables>;
export const SubmitAnswerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"submitAnswer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmissionMutationRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitAnswer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questionId"}},{"kind":"Field","name":{"kind":"Name","value":"numOfSubmission"}}]}}]}}]} as unknown as DocumentNode<SubmitAnswerMutation, SubmitAnswerMutationVariables>;

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
export const IquestionDocument = `
    query question($id: String!) {
  question(id: $id) {
    _id
    category1
    category2
    category3
    category4
    label
    description
    fileUrl
    answer
    type
    isTest
    options {
      value
      label
    }
  }
}
    `;
export const useQuestionQuery = <
      TData = QuestionQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: QuestionQueryVariables,
      options?: UseQueryOptions<QuestionQuery, TError, TData>
    ) =>
    useQuery<QuestionQuery, TError, TData>(
      ['question', variables],
      fetcher<QuestionQuery, QuestionQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, IquestionDocument, variables),
      options
    );
export const IsubmitAnswerDocument = `
    mutation submitAnswer($input: SubmissionMutationRequest!) {
  submitAnswer(input: $input) {
    questionId
    numOfSubmission
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