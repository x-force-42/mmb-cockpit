import { useCallback, useEffect, useRef, useState } from "react";

function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeToStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage indisponível (modo privado, quota cheia) → silenciar.
  }
}

/**
 * `useState`-like que persiste o valor em `localStorage` sob `key`.
 * - JSON corrompido → cai pro `defaultValue`.
 * - `localStorage` indisponível → vira `useState` puro.
 * Use chaves versionadas (`mmb-cockpit:filters:<scope>:v1`) pra invalidar
 * formatos antigos sem migração.
 */
export function usePersistedFilters<T>(
  key: string,
  defaultValue: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() =>
    readFromStorage<T>(key, defaultValue),
  );
  const keyRef = useRef(key);

  useEffect(() => {
    if (keyRef.current !== key) {
      keyRef.current = key;
      setValue(readFromStorage<T>(key, defaultValue));
    }
  }, [key, defaultValue]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        writeToStorage(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, set];
}
