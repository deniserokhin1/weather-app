import './style/style.css';
import { request } from './request';
import { templateEngine } from './templating-engine';

const inputBlock = document.querySelector('.input-block');
const input = inputBlock.querySelector('.input-block__input');
const inputInfo = inputBlock.querySelector('.input-block__text');
const buttonGetLocation = inputBlock.querySelector('.input-block__button');
const weatherBlock = document.querySelector('.weather-info');

const KEYAPI = '0ca28cfb4b769f30ddcd87d7a7ae911c';
const BASEURL = 'https://api.openweathermap.org/data/2.5/weather';

input.addEventListener('keyup', (event) => {
  if (event.key === 'Enter' && input.value) {
    searchWeatherByCity(input.value);
  }
});

buttonGetLocation.addEventListener('click', () => {
  navigator.geolocation
    ? searchWeatherByGeolocation()
    : alert('Ваш браузер не поддерживает API геолокацию');
});

function searchWeatherByCity(city) {
  changeTextOnPendingInfo();

  request({
    url: BASEURL,
    params: {
      q: city,
      units: 'metric',
      appid: KEYAPI,
    },
    onSuccess: (data) => {
      console.log(data);
      inputBlock.classList.add('hide');
      weatherBlock.classList.remove('hide');
      const { sunrise, sunset } = data.sys;
      const currentUnixTime = Math.round(new Date().getTime() / 1000);
      const sunriseTime = getTime(sunrise);
      const sunsetTime = getTime(sunset);
      const currentTime = getTime(currentUnixTime);
      templateEngine(data, sunriseTime, sunsetTime, currentTime);
    },
    onError: (data) => {
      inputInfo.textContent = data;
      inputInfo.classList.remove('input-block__text_pending');
      inputInfo.classList.add('input-block__text_error');
    },
  });
}

function getTime(unixTime) {
  const date = new Date(unixTime * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const time = hours + ':' + minutes + ':' + seconds;
  console.log(time);
}

function searchWeatherByGeolocation() {
  changeTextOnPendingInfo();
  navigator.geolocation.getCurrentPosition(onSuccessGeo, onErrorGeo);
}

function changeTextOnPendingInfo() {
  inputInfo.innerHTML =
    '<i class="fa fa-spin fa-refresh" aria-hidden="true"></i> Получение информации о погоде';
  inputInfo.classList.remove('input-block__text_error');
  inputInfo.classList.add('input-block__text_pending');
}

function onErrorGeo() {
  inputInfo.classList.remove('input-block__text_pending');
  inputInfo.classList.add('input-block__text_error');
  inputInfo.textContent = 'Разрешите определять геоданные';
}

function onSuccessGeo(data) {
  const { latitude, longitude } = data.coords;

  request({
    url: BASEURL,
    params: {
      lat: latitude,
      lon: longitude,
      units: 'metric',
      appid: KEYAPI,
    },
    onSuccess: (data) => {
      console.log(data);
      inputBlock.classList.add('hide');
      weatherBlock.classList.remove('hide');
    },
    onError: () => {},
  });
}
