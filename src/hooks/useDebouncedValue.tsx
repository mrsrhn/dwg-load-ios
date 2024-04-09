import {useEffect, useState} from 'react';

export function useDebouncedValue(initialValue: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [inputValue, delay]);

  const handleChange = (value: string) => {
    setInputValue(value);
  };

  return [debouncedValue, handleChange] as const;
}
