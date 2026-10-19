import { Suspense } from "react";
import type { AppProps } from "next/app";

import { Header } from "src/widgets/Header";
import { AuthChecker } from "src/entities/Auth/ui/AuthChecker";

import { ToastProvider } from "./providers/ToastProvider";

const App = (props: AppProps) => {
    const { Component, pageProps } = props;

    return (
        <Suspense fallback="">
            <AuthChecker>
                <ToastProvider>
                    <Header/>
                    <Component {...pageProps} />
                </ToastProvider>
            </AuthChecker>
        </Suspense>
    )
};

export default App;