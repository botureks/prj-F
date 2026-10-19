import { useRef } from "react";
import { AppProps } from "next/app";

import { ApolloProvider } from "@apollo/client";

import App from "src/app/App";

import { ThemeProvider } from "src/app/providers/ThemeProvider";
import { StoreProvider } from "src/app/providers/StoreProvider";
import { ErrorBoundary } from "src/app/providers/ErrorBoundary";

import { createApolloClient } from "src/shared/api/apollo-client";

import "../app/styles/index.less";

export default function NextApp(props: AppProps) {
    const clientRef = useRef(createApolloClient());

    return (
        <StoreProvider>
            <ThemeProvider>
                <ApolloProvider client={ clientRef.current }>
                    <ErrorBoundary>
                        <App {...props} />
                    </ErrorBoundary>
                </ApolloProvider>
            </ThemeProvider>
        </StoreProvider>
    );
}
