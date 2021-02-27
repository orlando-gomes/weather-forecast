import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { isToday, differenceInMinutes } from 'date-fns';

import api from '../services/apiClient';

export interface Coordinates {
  lat: number;
  lon: number;
}

interface PlacesContextData {
  myCity: ShortCityWeather;
  cities: Array<ShortCityWeather>;
}

interface CityGeolocation {
  name: string;
  country: string;
  date: Date;
}

interface CityGeolocationResponse {
  name: string;
  country: string;
}

interface CityWeatherResponse {
  main: {
    feels_like: number;
    humidity: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  name: string;
  sys: { country: string };
  weather: [{ description: string }];
  wind: { speed: number };
  coord: {
    lon: number;
    lat: number;
  };
}

export interface ShortCityWeather {
  name: string;
  lon: number;
  lat: number;
  country: string;
  temperature: number;
  temp_max: number;
  temp_min: number;
  date: Date;
}

const getCityNameByCoords = async (
  coords: Coordinates,
): Promise<CityGeolocationResponse> => {
  const geolocationResponse = await api.get(
    'http://api.openweathermap.org/geo/1.0/reverse',
    {
      params: {
        lat: coords.lat,
        lon: coords.lon,
        limit: 1,
      },
    },
  );

  const data: CityGeolocationResponse = geolocationResponse.data[0];

  return data;
};

const getLocationWeather = async (city: string): Promise<ShortCityWeather> => {
  const myLocationWeatherResponse = await api.get(
    'http://api.openweathermap.org/data/2.5/weather',
    {
      params: {
        q: city,
        lang: 'pt_br',
        units: 'metric',
      },
    },
  );

  const { data }: { data: CityWeatherResponse } = myLocationWeatherResponse;

  const shortCityWeather: ShortCityWeather = {
    name: data.name,
    lon: data.coord.lon,
    lat: data.coord.lat,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    temp_max: Math.round(data.main.temp_max),
    temp_min: Math.round(data.main.temp_min),
    date: new Date(),
  };

  return shortCityWeather;
};

const PlacesContext = createContext<PlacesContextData>({} as PlacesContextData);

const PlacesProvider: React.FC = ({ children }) => {
  const [myCity, setMyCity] = useState<ShortCityWeather>(
    {} as ShortCityWeather,
  );
  const [cities, setCities] = useState<Array<ShortCityWeather>>([]);

  const loadCitiesState = useCallback(async () => {
    const citiesStorage = localStorage.getItem(
      '@WeatherForecast:citiesWeather',
    );

    let citiesWeather: Array<ShortCityWeather> = [
      {
        name: '',
        lat: 0,
        lon: 0,
        country: '',
        temperature: 0,
        temp_max: 0,
        temp_min: 0,
        date: new Date(2000, 1),
      },
    ];

    if (citiesStorage) {
      citiesWeather = JSON.parse(citiesStorage);
    }

    if (!isToday(new Date(citiesWeather[0].date))) {
      const citiesNames = [
        'Brasília,Br',
        'Washington,Us',
        'Ottawa,Ca',
        'London,Uk',
        'Beijing,Cn',
      ];

      citiesWeather = await Promise.all(
        citiesNames.map(async name => {
          return getLocationWeather(name);
        }),
      );

      localStorage.setItem(
        '@WeatherForecast:citiesWeather',
        JSON.stringify(citiesWeather),
      );
    }

    setCities(citiesWeather);
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async myLocation => {
          const { latitude, longitude } = myLocation.coords;

          const myCityGeolocationStorage = localStorage.getItem(
            '@WeatherForecast:myCityGeolocation',
          );

          let myCityGeolocation: CityGeolocation = {
            name: '',
            country: '',
            date: new Date(2000, 1),
          };

          if (myCityGeolocationStorage) {
            myCityGeolocation = JSON.parse(myCityGeolocationStorage);
          }

          let city = '';

          if (
            differenceInMinutes(new Date(), new Date(myCityGeolocation.date)) <
            90
          ) {
            city = myCityGeolocation.name
              .concat(',')
              .concat(myCityGeolocation.country);
          } else {
            const data = await getCityNameByCoords({
              lat: latitude,
              lon: longitude,
            });

            city = data.name.concat(',').concat(data.country);
            myCityGeolocation = {
              name: data.name,
              country: data.country,
              date: new Date(),
            };

            localStorage.setItem(
              '@WeatherForecast:myCityGeolocation',
              JSON.stringify(myCityGeolocation),
            );
          }

          /// //
          const myCityStorage = localStorage.getItem(
            '@WeatherForecast:myCityWeather',
          );

          let myCityWeather: ShortCityWeather = {
            name: '',
            lon: 0,
            lat: 0,
            country: '',
            temperature: 0,
            temp_max: 0,
            temp_min: 0,
            date: new Date(2000, 1),
          };

          if (myCityStorage) {
            myCityWeather = JSON.parse(myCityStorage);
          }
          /// //

          if (!isToday(new Date(myCityWeather.date))) {
            myCityWeather = await getLocationWeather(city);

            localStorage.setItem(
              '@WeatherForecast:myCityWeather',
              JSON.stringify(myCityWeather),
            );
          }

          setMyCity(myCityWeather);

          await loadCitiesState();
        },
        () => {
          const getLocations = async () => {
            const myCityWeather = await getLocationWeather('Chicago,Us');

            setMyCity(myCityWeather);

            localStorage.setItem(
              '@WeatherForecast:myCityWeather',
              JSON.stringify(myCityWeather),
            );

            await loadCitiesState();
          };

          getLocations();
        },
      );
    } else {
      const getLocations = async () => {
        const myCityWeather = await getLocationWeather('Chicago,Us');

        setMyCity(myCityWeather);

        localStorage.setItem(
          '@WeatherForecast:myCityWeather',
          JSON.stringify(myCityWeather),
        );

        await loadCitiesState();
      };

      getLocations();
    }
  }, [loadCitiesState]);

  return (
    <PlacesContext.Provider value={{ myCity, cities }}>
      {children}
    </PlacesContext.Provider>
  );
};

function usePlaces(): PlacesContextData {
  const context = useContext(PlacesContext);

  if (!context) {
    throw new Error('usePlaces must be used within a PlacesProvider!');
  }

  return context;
}

export { PlacesProvider, usePlaces, getCityNameByCoords, getLocationWeather };
