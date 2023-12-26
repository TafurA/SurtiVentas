const TOKEN_API_DECODE: string = "SurtiApp:31a5a5b0140e0137e08aadaa60eb016a4b434812"

export const environment = {
  production: true,
  // API_URL: 'https://surtiappdev.surtilider.com:9001/',
  API_URL: 'https://intranet.surtilider.com:9001/',
  API_PATH: 'IntranetSurti/WebServicesRest',
  headers: {
    'Authorization': `Basic ${encodeTokenApi()}`,
  }
};

/**
 * Codificar el Token para el API
 * @private
 * @return { string }  {string}
 * @memberof InjectHttpHeaderInterceptor
 */
function encodeTokenApi(): string {
  return window.btoa(unescape(encodeURIComponent(TOKEN_API_DECODE)))
}
