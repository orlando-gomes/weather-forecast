import styled, { css, keyframes } from 'styled-components';

interface InputContainerProps {
  isFocused: boolean;
}

interface ForecastBoardProps {
  loadingBoard: boolean;
}

interface ErrMessageProps {
  hasAnyError: boolean;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  min-width: 350px;
  margin: 0 auto;
  padding: 18px 0 70px;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #fff;
`;

export const Title = styled.div`
  color: #fff;
  font-weight: bold;
  font-size: 48px;

  @media (max-width: 630px) {
    font-size: 36px;
  }
`;

export const ForecastBoard = styled.div<ForecastBoardProps>`
  width: 504px;
  min-height: 290px;
  margin: 36px 0 0;
  border-radius: 4px;
  padding: 24px 52px;
  display: flex;
  flex-direction: column;
  justify-content: left;
  background-color: #f8edc2;
  color: #888;
  font-weight: bold;

  ${props =>
    props.loadingBoard &&
    css`
      justify-content: center;
      svg {
        align-self: center;
        animation: ${rotate} 0.9s linear infinite;
      }
    `}

  @media (max-width: 630px) {
    width: 360px;
    min-width: 360px;
    padding: 24px 32px;
  }
`;

export const CityName = styled.div`
  font-size: 16px;
`;

export const Temperature = styled.div`
  margin-top: 16px;
  font-size: 36px;
`;

export const MinMax = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  font-size: 18px;
`;

export const WindAndHumidity = styled.div`
  display: flex;
  margin-top: 16px;
  font-size: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ffa500;

  div {
    span {
      color: #595959;
    }
  }

  div + div {
    margin-left: 16px;
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

export const WeekDays = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const DayBoard = styled.div`
  margin-top: 16px;

  div:first-child {
    color: #333;
    font-size: 18px;
    font-weight: normal;
  }

  div + div {
    color: #ffa500;
    font-weight: bold;
    font-size: 14px;
  }
`;

export const LastDayBoard = styled.div`
  margin-top: 16px;
  min-width: 60px;

  div:first-child {
    color: #333;
    font-size: 18px;
    font-weight: normal;
  }

  div + div {
    color: #ffa500;
    font-weight: bold;
    font-size: 14px;
  }

  @media (max-width: 630px) {
    display: none;
  }
`;

export const Input = styled.div<InputContainerProps>`
  width: 504px;
  height: 55px;
  margin: 64px 0;
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
