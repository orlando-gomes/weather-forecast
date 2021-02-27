import styled, { css } from 'styled-components';

interface InputContainerProps {
  isFocused: boolean;
  hasError: boolean;
}

export const Container = styled.div<InputContainerProps>`
  width: 504px;
  height: 55px;
  margin: 0 0 64px;
  border-radius: 4px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  ${props =>
    props.isFocused &&
    css`
      background-color: #ffffc0;
      border: 1px solid #bc8f8f;
    `}

  ${props =>
    props.hasError &&
    css`
      background-color: #ffc0c0;
      border: 1px solid #bc6666;

      input {
        color: #f22;
      }
    `}

  input {
    width: 420px;
    height: 55px;
    border: none;
    background-color: transparent;

    &::placeholder {
      color: #888;
    }
  }

  button {
    border: none;
    background-color: transparent;

    svg {
      color: #333;

      &:hover {
        color: #0aa;
      }
    }
  }

  @media (max-width: 630px) {
    width: 326px;
    height: 42px;

    input {
      width: 260px;
      height: 42px;
    }
  }
`;
