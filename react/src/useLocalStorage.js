import { useCallback } from "react";
import { useEffect, useState } from "react";

/**
 * A custom hook that has a similar interface to useState but
 * instead of storing the state in memory, it stores it in localStorage,
 * so it can be persisted across browser refreshes
 *
 * @param key the local storage key
 * @param initialValue initial value to load to localStorage
 * @returns localStorage value
 */
export function useLocalStorage(key, initialValue) {
  const [internalValue, setInternalValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        setInternalValue((prevValue) => {
          const valueToStore = value instanceof Function ? value(prevValue) : value;
          localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
      } catch (error) {
        console.log(error);
      }
    },
    [key]
  );

  useEffect(() => {
    function handleStorageChange() {
      try {
        const latestValue = localStorage.getItem(key);
        if (latestValue) {
          setInternalValue(JSON.parse(latestValue));
        }
      } catch (err) {
        console.error(err);
      }
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return [internalValue, setValue];
}