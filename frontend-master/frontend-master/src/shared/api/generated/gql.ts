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
    "\n    mutation SignIn($username: String!, $password: String!) {\n        signIn(input: { username: $username, password: $password }) {\n            message\n            user {\n                ...UserModel\n            }\n        }\n    }\n": types.SignInDocument,
    "\n    mutation SignUp($username: String!, $password: String!) {\n        signUp(input: { username: $username, password: $password }) {\n            message\n            user {\n                ...UserModel\n            }\n        }\n    }\n": types.SignUpDocument,
    "\n    mutation UserLogout {\n        userLogout {\n            message\n        }\n    }\n": types.UserLogoutDocument,
    "\n    query Comments($postId: String!) {\n        comments(postId: $postId) {\n            ...CommentModel\n        }\n    }\n": types.CommentsDocument,
    "\n    mutation CreateComment($postId: String!, $content: String!, $replyTo: String) {\n        createComment(createCommentInput: { postId: $postId, content: $content, replyTo: $replyTo }) {\n            ...CommentModel\n        }\n    }\n": types.CreateCommentDocument,
    "\n    mutation DeleteComment($id: String!) {\n        deleteComment(id: $id)\n    }\n": types.DeleteCommentDocument,
    "\n    fragment CommentModel on CommentEntity {\n            id\n            postId\n            replyTo\n            content\n            views\n            createdAt\n            updatedAt\n            author {\n                id\n                username\n                picture\n            }\n        }\n": types.CommentModelFragmentDoc,
    "\n    mutation CreatePost($title: String!, $topic: String!, $content: String!) {\n        createPost(createPostInput: { title: $title, topic: $topic, content: $content }) {\n            ...PostModel\n        }\n    }\n": types.CreatePostDocument,
    "\n    fragment PostModel on PostEntity {\n        id\n        title\n        topic\n        content\n        createdAt\n        updatedAt\n        author {\n            ...UserModel\n        }\n    }\n": types.PostModelFragmentDoc,
    "\n    query Post($id: String!) {\n        post(id: $id) {\n            ...PostModel\n        }\n    }\n": types.PostDocument,
    "\n    query Posts {\n        posts {\n            ...PostModel\n        }\n    }\n": types.PostsDocument,
    "\n    fragment UserModel on UserEntity {\n        id\n        username\n        picture\n    }\n": types.UserModelFragmentDoc,
    "\n    query Profile {\n        profile {\n            ...UserModel\n        }\n    }\n": types.ProfileDocument,
    "\n    mutation UploadAvatar($file: Upload!) {\n      uploadAvatar(file: $file) {\n        id\n        username\n        picture\n      }\n  }\n": types.UploadAvatarDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation SignIn($username: String!, $password: String!) {\n        signIn(input: { username: $username, password: $password }) {\n            message\n            user {\n                ...UserModel\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation SignIn($username: String!, $password: String!) {\n        signIn(input: { username: $username, password: $password }) {\n            message\n            user {\n                ...UserModel\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation SignUp($username: String!, $password: String!) {\n        signUp(input: { username: $username, password: $password }) {\n            message\n            user {\n                ...UserModel\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation SignUp($username: String!, $password: String!) {\n        signUp(input: { username: $username, password: $password }) {\n            message\n            user {\n                ...UserModel\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation UserLogout {\n        userLogout {\n            message\n        }\n    }\n"): (typeof documents)["\n    mutation UserLogout {\n        userLogout {\n            message\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Comments($postId: String!) {\n        comments(postId: $postId) {\n            ...CommentModel\n        }\n    }\n"): (typeof documents)["\n    query Comments($postId: String!) {\n        comments(postId: $postId) {\n            ...CommentModel\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CreateComment($postId: String!, $content: String!, $replyTo: String) {\n        createComment(createCommentInput: { postId: $postId, content: $content, replyTo: $replyTo }) {\n            ...CommentModel\n        }\n    }\n"): (typeof documents)["\n    mutation CreateComment($postId: String!, $content: String!, $replyTo: String) {\n        createComment(createCommentInput: { postId: $postId, content: $content, replyTo: $replyTo }) {\n            ...CommentModel\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation DeleteComment($id: String!) {\n        deleteComment(id: $id)\n    }\n"): (typeof documents)["\n    mutation DeleteComment($id: String!) {\n        deleteComment(id: $id)\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment CommentModel on CommentEntity {\n            id\n            postId\n            replyTo\n            content\n            views\n            createdAt\n            updatedAt\n            author {\n                id\n                username\n                picture\n            }\n        }\n"): (typeof documents)["\n    fragment CommentModel on CommentEntity {\n            id\n            postId\n            replyTo\n            content\n            views\n            createdAt\n            updatedAt\n            author {\n                id\n                username\n                picture\n            }\n        }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CreatePost($title: String!, $topic: String!, $content: String!) {\n        createPost(createPostInput: { title: $title, topic: $topic, content: $content }) {\n            ...PostModel\n        }\n    }\n"): (typeof documents)["\n    mutation CreatePost($title: String!, $topic: String!, $content: String!) {\n        createPost(createPostInput: { title: $title, topic: $topic, content: $content }) {\n            ...PostModel\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment PostModel on PostEntity {\n        id\n        title\n        topic\n        content\n        createdAt\n        updatedAt\n        author {\n            ...UserModel\n        }\n    }\n"): (typeof documents)["\n    fragment PostModel on PostEntity {\n        id\n        title\n        topic\n        content\n        createdAt\n        updatedAt\n        author {\n            ...UserModel\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Post($id: String!) {\n        post(id: $id) {\n            ...PostModel\n        }\n    }\n"): (typeof documents)["\n    query Post($id: String!) {\n        post(id: $id) {\n            ...PostModel\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Posts {\n        posts {\n            ...PostModel\n        }\n    }\n"): (typeof documents)["\n    query Posts {\n        posts {\n            ...PostModel\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment UserModel on UserEntity {\n        id\n        username\n        picture\n    }\n"): (typeof documents)["\n    fragment UserModel on UserEntity {\n        id\n        username\n        picture\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Profile {\n        profile {\n            ...UserModel\n        }\n    }\n"): (typeof documents)["\n    query Profile {\n        profile {\n            ...UserModel\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation UploadAvatar($file: Upload!) {\n      uploadAvatar(file: $file) {\n        id\n        username\n        picture\n      }\n  }\n"): (typeof documents)["\n    mutation UploadAvatar($file: Upload!) {\n      uploadAvatar(file: $file) {\n        id\n        username\n        picture\n      }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;