import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { FlagConfig } from './types';

// Constants
const STORAGE_KEY = 'useflag:overrides';

// Context
interface FlagContextValue {
  flags: FlagConfig;
  setFlag: (name: string, value: boolean) => void;
}

const FlagContext = createContext<FlagContextValue | null>(null);

// Provider Props
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
export function FlagProvider({ children, flags = {} }: FlagProviderProps) {
  const [providerFlags, setProviderFlags] = useState<FlagConfig>(flags);

  const setFlag = useCallback((name: string, value: boolean) => {
    setProviderFlags(prev => ({ ...prev, [name]: value }));
  }, []);

  const contextValue: FlagContextValue = {
    flags: providerFlags,
    setFlag,
  };

  return React.createElement(FlagContext.Provider, { value: contextValue }, children);
}

/**
 * Get local overrides from localStorage
 */
function getLocalOverrides(): FlagConfig {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save local overrides to localStorage
 */
function saveLocalOverrides(overrides: FlagConfig): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // Silent fail if localStorage is not available
  }
}

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
export function setFlagOverride(name: string, value: boolean): void {
  const overrides = getLocalOverrides();
  overrides[name] = value;
  saveLocalOverrides(overrides);

  // Dispatch custom event to notify all useFlag hooks
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('useflag:update', { detail: { name, value } }));
  }
}

/**
 * Clear a flag override from localStorage
 *
 * @param name - Flag name
 */
export function clearFlagOverride(name: string): void {
  const overrides = getLocalOverrides();
  delete overrides[name];
  saveLocalOverrides(overrides);

  // Dispatch custom event to notify all useFlag hooks
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('useflag:update', { detail: { name, value: undefined } }));
  }
}

/**
 * Clear all flag overrides from localStorage
 */
export function clearAllFlagOverrides(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('useflag:clear'));
  } catch {
    // Silent fail
  }
}

/**
 * Get all flag overrides from localStorage
 */
export function getAllFlagOverrides(): FlagConfig {
  return getLocalOverrides();
}

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
export function useFlag(name: string): boolean {
  const context = useContext(FlagContext);

  // Get initial value with priority: local override → provider → false
  const getInitialValue = useCallback(() => {
    const localOverrides = getLocalOverrides();

    if (name in localOverrides) {
      return localOverrides[name];
    }

    if (context && name in context.flags) {
      return context.flags[name];
    }

    return false;
  }, [name, context]);

  const [value, setValue] = useState<boolean>(getInitialValue);

  // Listen for flag updates
  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ name: string; value: boolean | undefined }>;
      if (customEvent.detail.name === name) {
        setValue(getInitialValue());
      }
    };

    const handleClear = () => {
      setValue(getInitialValue());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('useflag:update', handleUpdate);
      window.addEventListener('useflag:clear', handleClear);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('useflag:update', handleUpdate);
        window.removeEventListener('useflag:clear', handleClear);
      }
    };
  }, [name, getInitialValue]);

  // Update when context flags change
  useEffect(() => {
    setValue(getInitialValue());
  }, [getInitialValue]);

  return value;
}

// Re-export types
export type { FlagConfig } from './types';
