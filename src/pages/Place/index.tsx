import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { FaArrowDown, FaArrowUp, FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import {
  usePlaces,
  Coordinates,
  getCityNameByCoords,
  getLocationWeather,
} from '../../contexts/Places';

import api from '../../services/apiClient';
import Input from '../../components/Input';

import {
  Container,
  Header,
  Title,
  ForecastBoard,
  CityName,
  Temperature,
  MinMax,
  WindAndHumidity,
  ErrMessage,
  WeekDays,
  DayBoard,
  LastDayBoard,
  Metropolis,
  MTitle,
  MBody,
  Board,
  BTitle1,
  BTitle2,
  BLine,
} from './styles';

interface DailyResponse {
  dt: number;
  temp: {
    min: number;
    max: number;
  };
}

interface BoardDaily {
  day: string;
  min: number;
  max: number;
}

interface LongWeatherResponse {
  lat: number;
  lon: number;
  current: {
    dt: number;
    temp: number;
    feels_like: number;
    wind_speed: number;
    humidity: number;
    weather: [{ description: string }];
  };
  daily: Array<DailyResponse>;
}

interface BoardCityWeather {
  dt: Date;
  name: string;
  temp: number;
  min: number;
  max: number;
  feels_like: number;
  wind_speed: number;
  humidity: number;
  weather_description: string;
  firstFourDaily: Array<BoardDaily>;
  lastDaily: BoardDaily;
}

const Place: React.FC = () => {
  const [loadingBoard, setLoadingBoard] = useState<boolean>(false);
  const [inputField, setInputField] = useState('');
  const [inputError, setInputError] = useState(false);
  const { myCity, cities } = usePlaces();
  const history = useHistory<Coordinates | undefined>();
  const [boardCityWeather, setBoardCityWeather] = useState<BoardCityWeather>({
    dt: new Date(),
    name: '',
    temp: 0,
    min: 0,
    max: 0,
    feels_like: 0,
    wind_speed: 0,
    humidity: 0,
    weather_description: '',
    firstFourDaily: [] as Array<BoardDaily>,
    lastDaily: {
      day: '',
      min: 0,
      max: 0,
    },
  });

  const formattedDay = useMemo(() => {
    if (boardCityWeather.dt) {
      const dayName = format(boardCityWeather.dt, 'EEE', { locale: pt });
      return dayName.charAt(0).toUpperCase() + dayName.slice(1);
    }
    return '';
  }, [boardCityWeather]);

  const loadBoard = async (coords: Coordinates) => {
    setLoadingBoard(true);

    const cityNameResponse = await getCityNameByCoords({
      lat: coords.lat,
      lon: coords.lon,
    });

    const { data }: { data: LongWeatherResponse } = await api.get(
      'https://api.openweathermap.org/data/2.5/onecall',
      {
        params: {
          lat: coords.lat,
          lon: coords.lon,
          exclude: 'hourly,minutely,alerts',
          lang: 'pt_br',
          units: 'metric',
        },
      },
    );

    const allDailyWeather: Array<BoardDaily> = data.daily.map(aDay => {
      const dayName = format(aDay.dt * 1000, 'EEE', {
        locale: pt,
      });

      return {
        day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        max: Math.round(aDay.temp.max),
        min: Math.round(aDay.temp.min),
      };
    });

    const firstFourDaily = allDailyWeather.slice(1, 5);
    const lastDaily = allDailyWeather[5];

    const board: BoardCityWeather = {
      dt: new Date(data.current.dt * 1000),
      name: cityNameResponse.name.concat(', ').concat(cityNameResponse.country),
      temp: Math.round(data.current.temp),
      min: Math.round(allDailyWeather[0].min),
      max: Math.round(allDailyWeather[0].max),
      feels_like: Math.round(data.current.feels_like),
      humidity: Math.round(data.current.humidity),
      weather_description: data.current.weather[0].description,
      wind_speed: Math.round(data.current.wind_speed),
      firstFourDaily,
      lastDaily,
    };

    setBoardCityWeather(board);
    setLoadingBoard(false);
  };

  useEffect(() => {
    let coords = { lat: 0, lon: 0 };
    if (history.location.state) {
      coords = history.location.state;
    } else {
      coords = { lat: myCity.lat, lon: myCity.lon };
    }

    loadBoard(coords);
  }, [history, myCity.lat, myCity.lon]);

  const handleSearch = useCallback(async () => {
    try {
      const locationWeather = await getLocationWeather(inputField);
      const coords = {
        lat: locationWeather.lat,
        lon: locationWeather.lon,
      };
      await loadBoard(coords);
      setInputField('');
    } catch (err) {
      const errorMessage = (err as Error).message;
      if (errorMessage === 'Request failed with status code 404') {
        setInputError(true);
      }
    }
  }, [inputField]);

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

  const handleClickCity = useCallback((coords: Coordinates) => {
    loadBoard(coords);
  }, []);

  return (
    <Container>
      <Header>
        <Title>Previsão do tempo</Title>
        <ForecastBoard loadingBoard={loadingBoard}>
          {loadingBoard ? (
            <FaSpinner size={50} color="#ffa500" />
          ) : (
            <>
              <CityName>{`${boardCityWeather.name} - ${formattedDay}`}</CityName>
              <Temperature>{`${boardCityWeather.temp}°C ${boardCityWeather.weather_description}`}</Temperature>
              <MinMax>
                <FaArrowDown size={20} color="#ffa500" /> {boardCityWeather.min}
                °
                <FaArrowUp size={20} color="#ffa500" /> {boardCityWeather.max}°
                Sensação {boardCityWeather.feels_like}°C
              </MinMax>
              <WindAndHumidity>
                <div>
                  <span>Vento </span> {boardCityWeather.wind_speed}Km/h
                </div>
                <div>
                  <span>Humidade </span>
                  {boardCityWeather.humidity}%
                </div>
              </WindAndHumidity>
              <WeekDays>
                {boardCityWeather.firstFourDaily.map(dayBoard => (
                  <DayBoard key={dayBoard.day}>
                    <div>{dayBoard.day}</div>
                    <div>{`${dayBoard.min}° ${dayBoard.max}°`}</div>
                  </DayBoard>
                ))}

                <LastDayBoard>
                  <div>{boardCityWeather.lastDaily.day}</div>
                  <div>{`${boardCityWeather.lastDaily.min}° ${boardCityWeather.lastDaily.max}°`}</div>
                </LastDayBoard>
              </WeekDays>
            </>
          )}
        </ForecastBoard>

        <ErrMessage hasAnyError={inputError}>Cidade não encontrada!</ErrMessage>
        <Input
          value={inputField}
          onSearch={handleSearch}
          onAnyChange={handleChange}
          hasAnyError={inputError}
        />
      </Header>
      <Metropolis>
        <MTitle>Capitais</MTitle>

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

export default Place;
