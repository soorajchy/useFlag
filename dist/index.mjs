// src/index.ts
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
var STORAGE_KEY = "useflag:overrides";
var FlagContext = createContext(null);
function FlagProvider({ children, flags = {} }) {
  const [providerFlags, setProviderFlags] = useState(flags);
  const setFlag = useCallback((name, value) => {
    setProviderFlags((prev) => ({ ...prev, [name]: value }));
  }, []);
  const contextValue = {
    flags: providerFlags,
    setFlag
  };
  return React.createElement(FlagContext.Provider, { value: contextValue }, children);
}
function getLocalOverrides() {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}
function saveLocalOverrides(overrides) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
  }
}
function setFlagOverride(name, value) {
  const overrides = getLocalOverrides();
  overrides[name] = value;
  saveLocalOverrides(overrides);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("useflag:update", { detail: { name, value } }));
  }
}
function clearFlagOverride(name) {
  const overrides = getLocalOverrides();
  delete overrides[name];
  saveLocalOverrides(overrides);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("useflag:update", { detail: { name, value: void 0 } }));
  }
}
function clearAllFlagOverrides() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("useflag:clear"));
  } catch {
  }
}
function getAllFlagOverrides() {
  return getLocalOverrides();
}
function useFlag(name) {
  const context = useContext(FlagContext);
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
  const [value, setValue] = useState(getInitialValue);
  useEffect(() => {
    const handleUpdate = (event) => {
      const customEvent = event;
      if (customEvent.detail.name === name) {
        setValue(getInitialValue());
      }
    };
    const handleClear = () => {
      setValue(getInitialValue());
    };
    if (typeof window !== "undefined") {
      window.addEventListener("useflag:update", handleUpdate);
      window.addEventListener("useflag:clear", handleClear);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("useflag:update", handleUpdate);
        window.removeEventListener("useflag:clear", handleClear);
      }
    };
  }, [name, getInitialValue]);
  useEffect(() => {
    setValue(getInitialValue());
  }, [getInitialValue]);
  return value;
}
export {
  FlagProvider,
  clearAllFlagOverrides,
  clearFlagOverride,
  getAllFlagOverrides,
  setFlagOverride,
  useFlag
};
