import React, { useState, useCallback, InputHTMLAttributes } from 'react';
import { FaSearch } from 'react-icons/fa';

import { Container } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  hasAnyError: boolean;
  onSearch(): void;
  // eslint-disable-next-line no-unused-vars
  onAnyChange(word: string): void;
}

const Input: React.FC<InputProps> = ({
  hasAnyError,
  onAnyChange,
  onSearch,
  value,
  ...rest
}) => {
  const [inputIsFocused, setInputIsFocused] = useState(false);

  const handleInputFocus = useCallback(() => {
    setInputIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setInputIsFocused(false);
  }, []);

  const handleInputChanging = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      onAnyChange(e.currentTarget.value);
    },
    [onAnyChange],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch();
      }
    },
    [onSearch],
  );

  return (
    <Container hasError={hasAnyError} isFocused={inputIsFocused}>
      <input
        type="text"
        placeholder="Insira aqui o nome da cidade"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChange={handleInputChanging}
        onKeyDown={handleInputKeyDown}
        value={value}
        {...rest}
      />
      <button type="button" onClick={onSearch}>
        <FaSearch size={24} />
      </button>
    </Container>
  );
};

export default Input;
