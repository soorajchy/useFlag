import React, { ReactNode } from 'react';

interface FlagConfig {
    [key: string]: boolean;
}

interface FlagContextValue {
    flags: FlagConfig;
    setFlag: (name: string, value: boolean) => void;
}
interface FlagProviderProps {
    children: ReactNode;
    flags?: FlagConfig;
}
/**
 * FlagProvider - Provides default flag configuration to the app
 *
 * @example
 * ```tsx
 * <FlagProvider flags={{ darkMode: true, newFeature: false }}>
 *   <App />
 * </FlagProvider>
 * ```
 */
declare function FlagProvider({ children, flags }: FlagProviderProps): React.FunctionComponentElement<React.ProviderProps<FlagContextValue | null>>;
/**
 * Set a flag override in localStorage
 *
 * @param name - Flag name
 * @param value - Flag value (boolean)
 *
 * @example
 * ```ts
 * setFlagOverride('darkMode', true);
 * ```
 */
declare function setFlagOverride(name: string, value: boolean): void;
/**
 * Clear a flag override from localStorage
 *
 * @param name - Flag name
 */
declare function clearFlagOverride(name: string): void;
/**
 * Clear all flag overrides from localStorage
 */
declare function clearAllFlagOverrides(): void;
/**
 * Get all flag overrides from localStorage
 */
declare function getAllFlagOverrides(): FlagConfig;
/**
 * useFlag - Hook to access feature flags with priority: local override → provider → false
 *
 * @param name - Flag name
 * @returns boolean - Current flag value
 *
 * @example
 * ```tsx
 * const isDarkMode = useFlag('darkMode');
 *
 * return (
 *   <div className={isDarkMode ? 'dark' : 'light'}>
 *     {isDarkMode ? '🌙' : '☀️'}
 *   </div>
 * );
 * ```
 */
declare function useFlag(name: string): boolean;

export { type FlagConfig, FlagProvider, clearAllFlagOverrides, clearFlagOverride, getAllFlagOverrides, setFlagOverride, useFlag };
