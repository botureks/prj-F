import { Component, ErrorInfo, ReactNode, Suspense } from "react";

import axios from "axios";

import { ErrorPage } from "src/widgets/ErrorPage/ui/ErrorPage";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);

        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        axios.post('/analytics/error/push', {
            name: error.name,
            message: error.message,
            cause: error.cause,
            stack: error.stack,
            infoStack: errorInfo.componentStack,
            digest: errorInfo.digest,
            route: window.location.pathname
        }).catch((e) => console.error('Can`t post analytics', e));
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;

        if (hasError) {
            return (
                <Suspense fallback="">
                    <ErrorPage/>
                </Suspense>
            );
        }

        return children;
    }
}

export default ErrorBoundary;