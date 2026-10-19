"use client"
import { ReactNode, useEffect, useMemo, useState } from "react";

import { Theme } from "src/shared/const/theme";
import { LOCAL_STORAGE_THEME_KEY } from "src/shared/const/localstorage";

import { ThemeContext } from "src/shared/lib/context/ThemeContext";

interface ThemeProviderProps {
    initialTheme?: Theme;
    children: ReactNode;
}

const fallbackTheme = typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme : undefined;
console.log(fallbackTheme, 'fallback')

const ThemeProvider = (props: ThemeProviderProps) => {
    const { initialTheme, children } = props;
    const [isThemeInitialized, setThemeInitialized] = useState(false);

    const [theme, setTheme] = useState<Theme>(
        initialTheme || fallbackTheme || Theme.LIGHT,
    );

    useEffect(() => {
        if (!isThemeInitialized && initialTheme) {
            setTheme(initialTheme);
            setThemeInitialized(true);
        }
    }, [initialTheme, isThemeInitialized]);

    useEffect(() => {
        document.body.className = theme;

        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    }, [theme]);

    const defaultProps = useMemo(
        () => ({
            theme,
            setTheme,
        }),
        [theme],
    );

    return (
        <ThemeContext.Provider value={defaultProps}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;