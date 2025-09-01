'use client';

import * as React from 'react';
import {
    FluentProvider,
    webDarkTheme,
    webLightTheme,
    SSRProvider,
    RendererProvider,
    createDOMRenderer,
    renderToStyleElements,
    Theme,
} from '@fluentui/react-components';
import { useServerInsertedHTML } from 'next/navigation';
import { QueryProvider } from '../providers/query-client-provider';

// Create the context without an explicit interface, letting TypeScript infer
const ThemeContext = React.createContext<
    { currentTheme: Theme; toggleTheme: () => void; isDarkTheme: boolean } | undefined
>(undefined);

// Custom hook to use the theme context
export const useThemeSwitcher = () => {
    const context = React.useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeSwitcher must be used within a Providers');
    }
    return context;
};

export function Providers({ children, themeName }: { children: React.ReactNode; themeName: string }) {
    const [renderer] = React.useState(() => createDOMRenderer());
    const didRenderRef = React.useRef(false);

    // State to manage the current theme, initialized from themeName prop
    const [isDarkTheme, setIsDarkTheme] = React.useState(themeName === "webDarkTheme");
    const currentTheme = isDarkTheme ? webDarkTheme : webLightTheme;

    // Function to toggle the theme
    const toggleTheme = React.useCallback(() => {
        setIsDarkTheme(prev => !prev);
    }, []);

    useServerInsertedHTML(() => {
        if (didRenderRef.current) {
            return;
        }
        didRenderRef.current = true;
        return <>{renderToStyleElements(renderer)}</>;
    });

    return (
        <RendererProvider renderer={renderer}>
            <SSRProvider>
                <QueryProvider>
                    <ThemeContext.Provider value={{ currentTheme, toggleTheme, isDarkTheme }}>
                        <FluentProvider theme={currentTheme}>{children}</FluentProvider>
                    </ThemeContext.Provider>
                </QueryProvider>
            </SSRProvider>
        </RendererProvider>
    );
}