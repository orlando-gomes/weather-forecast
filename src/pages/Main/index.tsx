import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import {
  usePlaces,
  Coordinates,
  getLocationWeather,
} from '../../contexts/Places';
import Input from '../../components/Input';

import {
  Container,
  Header,
  ErrMessage,
  Metropolis,
  MTitle,
  MBody,
  Board,
  BTitle1,
  BTitle2,
  BLine,
} from './styles';

const Main: React.FC = () => {
  const [inputField, setInputField] = useState('');
  const [inputError, setInputError] = useState(false);
  const history = useHistory();
  const { myCity, cities } = usePlaces();

  const handleSearch = useCallback(async () => {
    try {
      const locationWeather = await getLocationWeather(inputField);
      const coords = {
        lat: locationWeather.lat,
        lon: locationWeather.lon,
      };
      history.push('/place', coords);
    } catch (err) {
      const errorMessage = (err as Error).message;
      if (errorMessage === 'Request failed with status code 404') {
        setInputError(true);
      }
    }
  }, [history, inputField]);

  const handleChange = useCallback(
    (word: string) => {
      if (inputError) {
        setInputError(false);
        setInputField(word.substr(word.length - 1));
      } else {
        setInputField(word);
      }
    },
    [inputError],
  );

  const handleClickCity = useCallback(
    (coords: Coordinates) => {
      history.push('/place', coords);
    },
    [history],
  );

  return (
    <Container>
      <Header>
        <div>Previsão do tempo</div>

        <ErrMessage hasAnyError={inputError}>Cidade não encontrada!</ErrMessage>
        <Input
          value={inputField}
          onSearch={handleSearch}
          onAnyChange={handleChange}
          hasAnyError={inputError}
        />
      </Header>
      <Metropolis>
        <MTitle>Locais</MTitle>

        <MBody>
          <Board>
            <BTitle1>
              <div>Min</div>
              <div>Máx</div>
            </BTitle1>
            {myCity && (
              <BLine
                onClick={() => {
                  handleClickCity({ lat: myCity.lat, lon: myCity.lon });
                }}
              >
                <div>{myCity?.temp_min}°</div>
                <div>{myCity?.temp_max}°</div>
                <div>{myCity?.name}</div>
              </BLine>
            )}

            {cities.map(
              (city, index) =>
                index < 2 && (
                  <BLine
                    key={city.name}
                    onClick={() => {
                      handleClickCity({ lat: city.lat, lon: city.lon });
                    }}
                  >
                    <div>{city.temp_min}°</div>
                    <div>{city.temp_max}°</div>
                    <div>{city.name}</div>
                  </BLine>
                ),
            )}
          </Board>

          <Board>
            <BTitle2>
              <div>Min</div>
              <div>Máx</div>
            </BTitle2>
            {cities.map(
              (city, index) =>
                index > 1 && (
                  <BLine
                    key={city.name}
                    onClick={() => {
                      handleClickCity({ lat: city.lat, lon: city.lon });
                    }}
                  >
                    <div>{city.temp_min}°</div>
                    <div>{city.temp_max}°</div>
                    <div>{city.name}</div>
                  </BLine>
                ),
            )}
          </Board>
        </MBody>
      </Metropolis>
    </Container>
  );
};

export default Main;
