import './style/style.css';
import './style/media.css';
import { request } from './request';
import { templateEngine } from './templating-engine';
import { tamplateDataWeather } from './tamplate-data-weather';
import { KEYAPI } from './key-api';

const inputBlock = document.querySelector('.input-block');
const input = inputBlock.querySelector('.input-block__input');
const inputInfo = inputBlock.querySelector('.input-block__text');
const buttonGetLocation = inputBlock.querySelector('.input-block__button');
const container = document.querySelector('.container');
const arrow = document.querySelector('.top__arrow');
const topTitle = document.querySelector('.top__title');

export let isNight = undefined;

const BASEURL = 'https://api.openweathermap.org/data/2.5/weather';

input.addEventListener('keyup', (event) => {
  if (event.key === 'Enter' && input.value) {
    searchWeatherByCity(input.value);
  }
});

arrow.addEventListener('click', () => {
  const weatherSection = document.querySelector('.weather-info');
  container.removeChild(weatherSection);
  topTitle.textContent = 'Погода';
  arrow.style.display = 'none';
  inputBlock.classList.remove('hide');
  input.value = '';
  input.focus();
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
      lang: 'ru',
      appid: KEYAPI,
    },
    onSuccess: (data) => {
      timesOfDay(data);
      showResult(data);
    },
    onError: (data) => {
      inputInfo.textContent = data;
      inputInfo.classList.remove('input-block__text_pending');
      inputInfo.classList.add('input-block__text_error');
    },
  });
}

function timesOfDay(data) {
  const iconTimesOfDay = data.weather[0].icon[2];
  if (iconTimesOfDay === 'n') {
    isNight = true;
  } else {
    isNight = false;
  }
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
      lang: 'ru',
      appid: KEYAPI,
    },
    onSuccess: (data) => {
      timesOfDay(data);
      showResult(data);
    },
    onError: () => {},
  });
}

function showResult(data) {
  hideInputBlock();
  container.appendChild(templateEngine(tamplateDataWeather(data)));
}

function hideInputBlock() {
  topTitle.textContent = 'Выбрать другой город';
  arrow.style.display = 'block';
  inputBlock.classList.add('hide');
  inputInfo.classList.remove('input-block__text_pending');
}
