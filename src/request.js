const noop = () => {};
const NO_HEADERS = {};
const noparams = {};
const OK_200 = [200];
const NO_BODY = {};

export function request({
  method = 'GET',
  url,
  params = noparams,
  headers = NO_HEADERS,
  body = NO_BODY,
  responseType = 'json',
  requestType = 'json',
  okResponces = OK_200,
  onSuccess = noop,
  onError = noop,
}) {
  const req = new XMLHttpRequest();
  const urlParams = new URLSearchParams(params);
  const queryString = urlParams.toString();

  req.open(method, url + (queryString ? `?${queryString}` : ''));

  Object.keys(headers).forEach((key) => {
    req.setRequestHeader(key, headers[key]);
  });

  req.responseType = responseType;

  req.onload = function (event) {
    const target = event.target;
    if (!okResponces.includes(target.status)) {
      onError('Город не найден');
      return;
    }

    onSuccess(target.response);
  };

  req.onerror = () => {
    onError('Нет Интернета');
    return;
  };

  let dataBody = body;

  if (requestType === 'urlencoded') {
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    const bodyParams = new URLSearchParams(body);
    dataBody = bodyParams.toString();
  }

  if (requestType === 'json' && dataBody !== NO_BODY) {
    req.setRequestHeader('Content-type', 'application/json');
    dataBody = JSON.stringify(body);
  }

  req.send(dataBody);
}
