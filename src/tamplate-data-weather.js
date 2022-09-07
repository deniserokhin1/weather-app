import { countries } from './country';
import { conditionWeather } from './codes-condition-weather';

export const tamplateDataWeather = (data) => ({
  tag: 'section',
  cls: 'weather-info',
  content: [
    {
      tag: 'div',
      cls: 'weather-wrapper',
      content: [
        {
          tag: 'div',
          cls: 'pic-deg',
          content: [
            {
              tag: 'div',
              cls: 'weather-picture',
              content: [
                {
                  tag: 'img',
                  cls: 'weather-picture__img',
                  attrs: {
                    src: conditionWeather[data.weather[0].id],
                    'aria-hidden': true,
                  },
                },
              ],
            },
            {
              tag: 'div',
              cls: 'weather-info__real-temp',
              content: [
                {
                  tag: 'h3',
                  content: [
                    Math.floor(data.main.temp),
                    {
                      tag: 'span',
                      content: '°C',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      tag: 'div',
      cls: 'location',
      content: [
        {
          tag: 'div',
          cls: 'location__weather-condition',
          content: [
            {
              tag: 'h2',
              content: data.weather[0].description,
            },
          ],
        },
        {
          tag: 'div',
          cls: 'location-city',
          content: [
            {
              tag: 'h2',
              cls: 'location__icon__title',
              content: [
                {
                  tag: 'i',
                  cls: ['location-city__icon', 'fa', 'fa-map-marker'],
                  attrs: {
                    'aria-hidden': true,
                  },
                },
                `${data.name}, ${countries[data.sys.country]}`,
              ],
            },
          ],
        },
      ],
    },
    {
      tag: 'div',
      cls: 'weather-info__details',
      content: [
        {
          tag: 'div',
          cls: 'feels-like',
          content: [
            {
              tag: 'i',
              cls: [
                'weather-info__icon',
                'feels-like__thermometer',
                'fa',
                'fa-thermometer-three-quarters',
              ],
              attrs: {
                'aria-hidden': true,
              },
            },
            {
              tag: 'div',
              cls: 'feels-like__temp',
              content: `Ощущается как ${Math.floor(data.main.feels_like)}°C`,
            },
          ],
        },
        {
          tag: 'div',
          cls: 'humidity',
          content: [
            {
              tag: 'i',
              cls: ['weather-info__icon', 'humidity__icon', 'fa', 'fa-tint'],
              attrs: {
                'aria-hidden': true,
              },
            },
            {
              tag: 'div',
              cls: 'humidity__info',
              content: `Влажность ${data.main.humidity}%`,
            },
          ],
        },
      ],
    },
  ],
});
