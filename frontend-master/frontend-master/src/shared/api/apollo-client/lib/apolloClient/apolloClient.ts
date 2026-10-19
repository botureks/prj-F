import { ApolloClient, InMemoryCache } from "@apollo/client";

// @ts-ignore
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

import * as process from "process";

const isServer = typeof window === "undefined";

// На сервере (SSR) используем внутренний Docker-адрес бэкенда,
// на клиенте — публичный URL, доступный браузеру.
const uri = isServer
    ? (process.env.INTERNAL_GRAPHQL_URL || process.env.GRAPHQL_URL)
    : process.env.GRAPHQL_URL;

const httpLink = new createUploadLink({
    uri,
    credentials: "include",
});

export const createApolloClient = () => new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
    ssrMode: isServer,
    ssrForceFetchDelay: isServer ? 100 : 0,
});