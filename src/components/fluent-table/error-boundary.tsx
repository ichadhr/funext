import React, { ErrorInfo, ReactNode } from 'react';
import { MessageBar, MessageBarBody, MessageBarTitle } from '@fluentui/react-components';

interface ErrorBoundaryProps {
    children: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error in FluentTable:", error, errorInfo);
        this.setState({ errorInfo });
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            // Render Fluent UI MessageBar as fallback UI
            return (
                <MessageBar intent="error">
                    <MessageBarBody>
                        <MessageBarTitle>Table error: </MessageBarTitle>
                        An unexpected error occurred while rendering the table.
                    </MessageBarBody>
                </MessageBar>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;