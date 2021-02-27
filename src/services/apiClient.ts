import axios from 'axios';

const api = axios.create({
  params: {
    appid: process.env.REACT_APP_OPENWEATHER_KEY,
  },
});

export default api;
