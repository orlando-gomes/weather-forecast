import styled, { css } from 'styled-components';

interface ErrMessageProps {
  hasAnyError: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  min-width: 350px;
  margin: 0 auto;
  padding: 56px 0 70px;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #fff;

  div:first-child {
    color: #fff;
    font-weight: bold;
    font-size: 64px;
  }

  @media (max-width: 630px) {
    div:first-child {
      font-size: 36px;
    }
  }
`;

export const ErrMessage = styled.div<ErrMessageProps>`
  margin: 20px 0;
  color: transparent;

  ${props =>
    props.hasAnyError &&
    css`
      color: #f22;
    `}
`;

export const Metropolis = styled.div``;

export const MTitle = styled.div`
  margin: 24px 0;
  color: #fff;
  font-weight: bold;
  font-size: 36px;
`;

export const MBody = styled.div`
  display: flex;

  @media (max-width: 630px) {
    flex-direction: column;
  }
`;

export const Board = styled.div`
  padding: 0 8px;
  min-width: 260px;
`;

export const BTitle1 = styled.div`
  display: flex;
  font-weight: lighter;

  div {
    min-width: 48px;
    text-align: center;
  }
`;

export const BTitle2 = styled.div`
  display: flex;
  font-weight: lighter;

  div {
    min-width: 48px;
    text-align: center;
  }

  @media (max-width: 630px) {
    display: none;
  }
`;

export const BLine = styled.button`
  display: flex;
  font-weight: bold;
  margin-top: 8px;
  padding: 0 4px;
  background-color: transparent;
  border-radius: 8px;
  border: none;
  color: #222;

  &:hover {
    background-color: #fffa8d;
    color: #0aa;
  }

  div {
    min-width: 48px;
    text-align: center;
  }
`;
