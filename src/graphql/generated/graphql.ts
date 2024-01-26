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
  updatedAt?: Maybe<Scalars['Float']['output']>;
};

export type CardVerifyRequest = {
  code: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: Token;
  submitAnswer: Answer;
  updateProfile: Profile;
};


export type MutationLoginArgs = {
  input: CardVerifyRequest;
};


export type MutationSubmitAnswerArgs = {
  input: AnswerMutationRequest;
};


export type MutationUpdateProfileArgs = {
  input: ProfileMutationRequest;
};

export type Profile = {
  __typename?: 'Profile';
  _id: Scalars['ID']['output'];
  address?: Maybe<Scalars['String']['output']>;
  colorVision?: Maybe<Scalars['String']['output']>;
  createdOn?: Maybe<Scalars['Float']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fathersEducation?: Maybe<Scalars['String']['output']>;
  fathersMonthlyIncome?: Maybe<Scalars['String']['output']>;
  fathersWork?: Maybe<Scalars['String']['output']>;
  fathersYearOfBirth?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  grade?: Maybe<Scalars['String']['output']>;
  interest?: Maybe<Scalars['String']['output']>;
  mothersEducation?: Maybe<Scalars['String']['output']>;
  mothersMontylyIncome?: Maybe<Scalars['String']['output']>;
  mothersWork?: Maybe<Scalars['String']['output']>;
  mothersYearOfBirth?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nation?: Maybe<Scalars['String']['output']>;
  school?: Maybe<Scalars['String']['output']>;
  schoolRoll?: Maybe<Scalars['String']['output']>;
  speciality?: Maybe<Scalars['String']['output']>;
  studentType?: Maybe<Scalars['String']['output']>;
  telephone?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Float']['output']>;
  vision?: Maybe<Scalars['String']['output']>;
  yearOfBirth?: Maybe<Scalars['String']['output']>;
};

export type ProfileMutationRequest = {
  address?: InputMaybe<Scalars['String']['input']>;
  colorVision: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  fathersEducation: Scalars['String']['input'];
  fathersMonthlyIncome: Scalars['String']['input'];
  fathersWork: Scalars['String']['input'];
  fathersYearOfBirth: Scalars['String']['input'];
  gender: Scalars['String']['input'];
  grade: Scalars['String']['input'];
  interest?: InputMaybe<Scalars['String']['input']>;
  mothersEducation: Scalars['String']['input'];
  mothersMontylyIncome: Scalars['String']['input'];
  mothersWork: Scalars['String']['input'];
  mothersYearOfBirth: Scalars['String']['input'];
  name: Scalars['String']['input'];
  nation: Scalars['String']['input'];
  school: Scalars['String']['input'];
  schoolRoll: Scalars['String']['input'];
  speciality?: InputMaybe<Scalars['String']['input']>;
  studentType: Scalars['String']['input'];
  telephone: Scalars['String']['input'];
  vision: Scalars['String']['input'];
  yearOfBirth: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  answer?: Maybe<Answer>;
  answers?: Maybe<Array<Answer>>;
  generateCards: Array<Card>;
  profile?: Maybe<Profile>;
  submissions?: Maybe<Array<Submission>>;
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


export type QuerySubmissionsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type Submission = {
  __typename?: 'Submission';
  _id: Scalars['ID']['output'];
  activeQuestionId?: Maybe<Scalars['String']['output']>;
  answers?: Maybe<Array<Answer>>;
  createdOn?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Float']['output']>;
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

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = { __typename?: 'Query', profile?: { __typename?: 'Profile', name?: string | null, gender?: string | null, yearOfBirth?: string | null, nation?: string | null, schoolRoll?: string | null, studentType?: string | null, school?: string | null, grade?: string | null, colorVision?: string | null, vision?: string | null, speciality?: string | null, interest?: string | null, fathersYearOfBirth?: string | null, fathersWork?: string | null, fathersEducation?: string | null, fathersMonthlyIncome?: string | null, mothersYearOfBirth?: string | null, mothersWork?: string | null, mothersEducation?: string | null, mothersMontylyIncome?: string | null, email?: string | null, telephone?: string | null, address?: string | null } | null };

export type UpdateProfileMutationVariables = Exact<{
  input: ProfileMutationRequest;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'Profile', name?: string | null, gender?: string | null, yearOfBirth?: string | null, nation?: string | null, schoolRoll?: string | null, studentType?: string | null, school?: string | null, grade?: string | null, colorVision?: string | null, vision?: string | null, speciality?: string | null, interest?: string | null, fathersYearOfBirth?: string | null, fathersWork?: string | null, fathersEducation?: string | null, fathersMonthlyIncome?: string | null, mothersYearOfBirth?: string | null, mothersWork?: string | null, mothersEducation?: string | null, mothersMontylyIncome?: string | null, email?: string | null, telephone?: string | null, address?: string | null } };

export type SubmitAnswerMutationVariables = Exact<{
  input: AnswerMutationRequest;
}>;


export type SubmitAnswerMutation = { __typename?: 'Mutation', submitAnswer: { __typename?: 'Answer', questionId: string, numOfSubmission?: number | null, isCorrect?: boolean | null, startTime?: number | null, endTime?: number | null, duration?: number | null } };

export type SubmissionsQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SubmissionsQuery = { __typename?: 'Query', submissions?: Array<{ __typename?: 'Submission', _id: string, answers?: Array<{ __typename?: 'Answer', questionId: string, answer?: string | null, isCorrect?: boolean | null, duration?: number | null }> | null }> | null };


export const AnswerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"answer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"questionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"numOfSubmission"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<AnswerQuery, AnswerQueryVariables>;
export const AnswersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"answers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"questionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questionId"}}]}}]}}]} as unknown as DocumentNode<AnswersQuery, AnswersQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CardVerifyRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const ProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"yearOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"nation"}},{"kind":"Field","name":{"kind":"Name","value":"schoolRoll"}},{"kind":"Field","name":{"kind":"Name","value":"studentType"}},{"kind":"Field","name":{"kind":"Name","value":"school"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"colorVision"}},{"kind":"Field","name":{"kind":"Name","value":"vision"}},{"kind":"Field","name":{"kind":"Name","value":"speciality"}},{"kind":"Field","name":{"kind":"Name","value":"interest"}},{"kind":"Field","name":{"kind":"Name","value":"fathersYearOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"fathersWork"}},{"kind":"Field","name":{"kind":"Name","value":"fathersEducation"}},{"kind":"Field","name":{"kind":"Name","value":"fathersMonthlyIncome"}},{"kind":"Field","name":{"kind":"Name","value":"mothersYearOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"mothersWork"}},{"kind":"Field","name":{"kind":"Name","value":"mothersEducation"}},{"kind":"Field","name":{"kind":"Name","value":"mothersMontylyIncome"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"telephone"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}}]} as unknown as DocumentNode<ProfileQuery, ProfileQueryVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProfileMutationRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"yearOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"nation"}},{"kind":"Field","name":{"kind":"Name","value":"schoolRoll"}},{"kind":"Field","name":{"kind":"Name","value":"studentType"}},{"kind":"Field","name":{"kind":"Name","value":"school"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"colorVision"}},{"kind":"Field","name":{"kind":"Name","value":"vision"}},{"kind":"Field","name":{"kind":"Name","value":"speciality"}},{"kind":"Field","name":{"kind":"Name","value":"interest"}},{"kind":"Field","name":{"kind":"Name","value":"fathersYearOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"fathersWork"}},{"kind":"Field","name":{"kind":"Name","value":"fathersEducation"}},{"kind":"Field","name":{"kind":"Name","value":"fathersMonthlyIncome"}},{"kind":"Field","name":{"kind":"Name","value":"mothersYearOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"mothersWork"}},{"kind":"Field","name":{"kind":"Name","value":"mothersEducation"}},{"kind":"Field","name":{"kind":"Name","value":"mothersMontylyIncome"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"telephone"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const SubmitAnswerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"submitAnswer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerMutationRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitAnswer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questionId"}},{"kind":"Field","name":{"kind":"Name","value":"numOfSubmission"}},{"kind":"Field","name":{"kind":"Name","value":"isCorrect"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<SubmitAnswerMutation, SubmitAnswerMutationVariables>;
export const SubmissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"submissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questionId"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"isCorrect"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]}}]} as unknown as DocumentNode<SubmissionsQuery, SubmissionsQueryVariables>;

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
export const IprofileDocument = `
    query profile {
  profile {
    name
    gender
    yearOfBirth
    nation
    schoolRoll
    studentType
    school
    grade
    colorVision
    vision
    speciality
    interest
    fathersYearOfBirth
    fathersWork
    fathersEducation
    fathersMonthlyIncome
    mothersYearOfBirth
    mothersWork
    mothersEducation
    mothersMontylyIncome
    email
    telephone
    address
  }
}
    `;
export const useProfileQuery = <
      TData = ProfileQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables?: ProfileQueryVariables,
      options?: UseQueryOptions<ProfileQuery, TError, TData>
    ) =>
    useQuery<ProfileQuery, TError, TData>(
      variables === undefined ? ['profile'] : ['profile', variables],
      fetcher<ProfileQuery, ProfileQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, IprofileDocument, variables),
      options
    );
export const IupdateProfileDocument = `
    mutation updateProfile($input: ProfileMutationRequest!) {
  updateProfile(input: $input) {
    name
    gender
    yearOfBirth
    nation
    schoolRoll
    studentType
    school
    grade
    colorVision
    vision
    speciality
    interest
    fathersYearOfBirth
    fathersWork
    fathersEducation
    fathersMonthlyIncome
    mothersYearOfBirth
    mothersWork
    mothersEducation
    mothersMontylyIncome
    email
    telephone
    address
  }
}
    `;
export const useUpdateProfileMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<UpdateProfileMutation, TError, UpdateProfileMutationVariables, TContext>
    ) =>
    useMutation<UpdateProfileMutation, TError, UpdateProfileMutationVariables, TContext>(
      ['updateProfile'],
      (variables?: UpdateProfileMutationVariables) => fetcher<UpdateProfileMutation, UpdateProfileMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, IupdateProfileDocument, variables)(),
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
export const IsubmissionsDocument = `
    query submissions($cursor: String, $limit: Int) {
  submissions(cursor: $cursor, limit: $limit) {
    _id
    answers {
      questionId
      answer
      isCorrect
      duration
    }
  }
}
    `;
export const useSubmissionsQuery = <
      TData = SubmissionsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables?: SubmissionsQueryVariables,
      options?: UseQueryOptions<SubmissionsQuery, TError, TData>
    ) =>
    useQuery<SubmissionsQuery, TError, TData>(
      variables === undefined ? ['submissions'] : ['submissions', variables],
      fetcher<SubmissionsQuery, SubmissionsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, IsubmissionsDocument, variables),
      options
    );