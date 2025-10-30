# @uikudo/useflag

A lightweight, simple feature flag library for React applications with local override support.

## Features

- **FlagProvider**: React Context provider for default flag configuration
- **useFlag Hook**: Simple hook that returns boolean values
- **Priority System**: Local override → Provider value → false
- **localStorage Persistence**: Override flags persist across sessions
- **TypeScript Support**: Full TypeScript definitions included
- **Tiny Bundle Size**: Minimal footprint for your application
- **SSR Safe**: Works with server-side rendering

## Installation

```bash
npm install @uikudo/useflag
# or
pnpm add @uikudo/useflag
# or
yarn add @uikudo/useflag
```

## Quick Start

### 1. Wrap your app with FlagProvider

```tsx
import { FlagProvider } from '@uikudo/useflag';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <FlagProvider flags={{ darkMode: true, premium: false }}>
    <App />
  </FlagProvider>
);
```

### 2. Use flags in your components

```tsx
import { useFlag } from '@uikudo/useflag';

function MyComponent() {
  const isDarkMode = useFlag('darkMode');
  const isPremium = useFlag('premium');

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      {isPremium && <PremiumFeature />}
    </div>
  );
}
```

### 3. Override flags locally (optional)

```tsx
import { setFlagOverride, clearFlagOverride } from '@uikudo/useflag';

// Set an override
setFlagOverride('darkMode', false);

// Clear an override (falls back to provider value)
clearFlagOverride('darkMode');
```

## API Reference

### `<FlagProvider>`

Provides default flag configuration to your application.

**Props:**
- `flags?: FlagConfig` - Object mapping flag names to boolean values
- `children: ReactNode` - Your application components

**Example:**
```tsx
<FlagProvider flags={{
  darkMode: true,
  newFeature: false,
  beta: true
}}>
  <App />
</FlagProvider>
```

### `useFlag(name: string): boolean`

Hook to access a feature flag value.

**Parameters:**
- `name: string` - The name of the flag

**Returns:**
- `boolean` - The current flag value

**Priority:**
1. Local override (from localStorage)
2. Provider value (from FlagProvider)
3. `false` (default)

**Example:**
```tsx
const isDarkMode = useFlag('darkMode');
const isNewFeature = useFlag('newFeature');
```

### `setFlagOverride(name: string, value: boolean): void`

Set a local override for a flag. Stored in localStorage and persists across sessions.

**Parameters:**
- `name: string` - Flag name
- `value: boolean` - Flag value

**Example:**
```tsx
setFlagOverride('darkMode', true);
```

### `clearFlagOverride(name: string): void`

Clear a local override. Flag will fall back to provider value or false.

**Parameters:**
- `name: string` - Flag name

**Example:**
```tsx
clearFlagOverride('darkMode');
```

### `clearAllFlagOverrides(): void`

Clear all local overrides.

**Example:**
```tsx
clearAllFlagOverrides();
```

### `getAllFlagOverrides(): FlagConfig`

Get all current local overrides.

**Returns:**
- `FlagConfig` - Object with all override flags

**Example:**
```tsx
const overrides = getAllFlagOverrides();
console.log(overrides); // { darkMode: true, premium: false }
```

## Priority System

Flags are resolved with the following priority:

1. **Local Override** (highest priority)
   - Stored in `localStorage` with key `useflag:overrides`
   - Persists across browser sessions
   - Set via `setFlagOverride()`

2. **Provider Value**
   - Defined in `<FlagProvider flags={...}>`
   - Application-level defaults

3. **Default Value** (lowest priority)
   - Always `false` if not defined elsewhere

## localStorage Structure

Overrides are stored in localStorage under the key `useflag:overrides`:

```json
{
  "darkMode": true,
  "premium": false,
  "beta": true
}
```

## TypeScript

Full TypeScript support included:

```tsx
import type { FlagConfig } from '@uikudo/useflag';

const myFlags: FlagConfig = {
  darkMode: true,
  premium: false,
};
```

## Examples

### Basic Usage

```tsx
import { FlagProvider, useFlag } from '@uikudo/useflag';

function App() {
  return (
    <FlagProvider flags={{ darkMode: true }}>
      <Dashboard />
    </FlagProvider>
  );
}

function Dashboard() {
  const isDarkMode = useFlag('darkMode');

  return (
    <div className={isDarkMode ? 'dark-theme' : 'light-theme'}>
      Dashboard
    </div>
  );
}
```

### With Local Overrides

```tsx
import { useFlag, setFlagOverride } from '@uikudo/useflag';

function FeatureToggle() {
  const isEnabled = useFlag('newFeature');

  return (
    <div>
      <p>Feature is {isEnabled ? 'enabled' : 'disabled'}</p>
      <button onClick={() => setFlagOverride('newFeature', !isEnabled)}>
        Toggle Feature
      </button>
    </div>
  );
}
```

### Development Tools

```tsx
import { getAllFlagOverrides, clearAllFlagOverrides } from '@uikudo/useflag';

function DevTools() {
  const [overrides, setOverrides] = useState(getAllFlagOverrides());

  const handleReset = () => {
    clearAllFlagOverrides();
    setOverrides({});
  };

  return (
    <div>
      <h3>Current Overrides</h3>
      <pre>{JSON.stringify(overrides, null, 2)}</pre>
      <button onClick={handleReset}>Reset All</button>
    </div>
  );
}
```

## Best Practices

1. **Define flags in one place**: Use `FlagProvider` at your app root with all flags
2. **Use descriptive names**: `darkMode`, `premiumFeatures`, `experimentalUI`
3. **Document your flags**: Keep a list of all flags and their purposes
4. **Clean up old flags**: Remove unused flags from your codebase
5. **Dev tools**: Create a dev panel to toggle flags during development

## Browser Support

Works in all modern browsers that support:
- React 18+
- localStorage
- CustomEvent API

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Author

uikudo
