import './style/style.css';
import { request } from './request';
import { templateEngine } from './templating-engine';
import { tamplateDataWeather } from './tamplate-data-weather';
import { countries } from './country';
import { KEYAPI } from './key-api';

const inputBlock = document.querySelector('.input-block');
const input = inputBlock.querySelector('.input-block__input');
const inputInfo = inputBlock.querySelector('.input-block__text');
const buttonGetLocation = inputBlock.querySelector('.input-block__button');
const container = document.querySelector('.container');
const arrow = document.querySelector('.top__arrow');
const topTitle = document.querySelector('.top__title');

const BASEURL = 'https://api.openweathermap.org/data/2.5/weather';

console.log(countries);

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
      showResult(data);
    },
    onError: (data) => {
      inputInfo.textContent = data;
      inputInfo.classList.remove('input-block__text_pending');
      inputInfo.classList.add('input-block__text_error');
    },
  });
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
      showResult(data);
    },
    onError: () => {},
  });
}

function showResult(data) {
  topTitle.textContent = 'Выбрать другой город';
  arrow.style.display = 'block';
  inputBlock.classList.add('hide');
  container.appendChild(templateEngine(tamplateDataWeather(data)));
  inputInfo.classList.remove('input-block__text_pending');
}
