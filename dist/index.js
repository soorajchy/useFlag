"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  FlagProvider: () => FlagProvider,
  clearAllFlagOverrides: () => clearAllFlagOverrides,
  clearFlagOverride: () => clearFlagOverride,
  getAllFlagOverrides: () => getAllFlagOverrides,
  setFlagOverride: () => setFlagOverride,
  useFlag: () => useFlag
});
module.exports = __toCommonJS(index_exports);
var import_react = __toESM(require("react"));
var STORAGE_KEY = "useflag:overrides";
var FlagContext = (0, import_react.createContext)(null);
function FlagProvider({ children, flags = {} }) {
  const [providerFlags, setProviderFlags] = (0, import_react.useState)(flags);
  const setFlag = (0, import_react.useCallback)((name, value) => {
    setProviderFlags((prev) => ({ ...prev, [name]: value }));
  }, []);
  const contextValue = {
    flags: providerFlags,
    setFlag
  };
  return import_react.default.createElement(FlagContext.Provider, { value: contextValue }, children);
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
  const context = (0, import_react.useContext)(FlagContext);
  const getInitialValue = (0, import_react.useCallback)(() => {
    const localOverrides = getLocalOverrides();
    if (name in localOverrides) {
      return localOverrides[name];
    }
    if (context && name in context.flags) {
      return context.flags[name];
    }
    return false;
  }, [name, context]);
  const [value, setValue] = (0, import_react.useState)(getInitialValue);
  (0, import_react.useEffect)(() => {
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
  (0, import_react.useEffect)(() => {
    setValue(getInitialValue());
  }, [getInitialValue]);
  return value;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FlagProvider,
  clearAllFlagOverrides,
  clearFlagOverride,
  getAllFlagOverrides,
  setFlagOverride,
  useFlag
});
