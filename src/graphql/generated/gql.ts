/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query answer($questionId: String!) {\n  answer(questionId: $questionId) {\n    answer\n    startTime\n    endTime\n    numOfSubmission\n    duration\n  }\n}\n\nquery answers($questionId: String!) {\n  answers(questionId: $questionId) {\n    questionId\n  }\n}": types.AnswerDocument,
    "mutation login($input: CardVerifyRequest!) {\n  login(input: $input) {\n    accessToken\n  }\n}": types.LoginDocument,
    "mutation submitAnswer($input: AnswerMutationRequest!) {\n  submitAnswer(input: $input) {\n    questionId\n    numOfSubmission\n    isCorrect\n    startTime\n    endTime\n    duration\n  }\n}": types.SubmitAnswerDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query answer($questionId: String!) {\n  answer(questionId: $questionId) {\n    answer\n    startTime\n    endTime\n    numOfSubmission\n    duration\n  }\n}\n\nquery answers($questionId: String!) {\n  answers(questionId: $questionId) {\n    questionId\n  }\n}"): (typeof documents)["query answer($questionId: String!) {\n  answer(questionId: $questionId) {\n    answer\n    startTime\n    endTime\n    numOfSubmission\n    duration\n  }\n}\n\nquery answers($questionId: String!) {\n  answers(questionId: $questionId) {\n    questionId\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation login($input: CardVerifyRequest!) {\n  login(input: $input) {\n    accessToken\n  }\n}"): (typeof documents)["mutation login($input: CardVerifyRequest!) {\n  login(input: $input) {\n    accessToken\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation submitAnswer($input: AnswerMutationRequest!) {\n  submitAnswer(input: $input) {\n    questionId\n    numOfSubmission\n    isCorrect\n    startTime\n    endTime\n    duration\n  }\n}"): (typeof documents)["mutation submitAnswer($input: AnswerMutationRequest!) {\n  submitAnswer(input: $input) {\n    questionId\n    numOfSubmission\n    isCorrect\n    startTime\n    endTime\n    duration\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;