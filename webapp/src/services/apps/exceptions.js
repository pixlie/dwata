export const AppExceptionCodes = Object.freeze({
  notEnabled: "notEnabled",
  configNotLoaded: "configNotLoaded",
  dataNotLoaded: "dataNotLoaded",
});


export function AppException(code, appName) {
  this.code = code;
  this.appName = appName;

  const getMessage = () => {
    if (this.code === AppExceptionCodes.notEnabled) {
      return `The app ${this.appName} is not enabled`;
    } else if (this.code === AppExceptionCodes.configNotLoaded) {
      return `The config for the app ${this.appName} have not been loaded yet`;
    }
  }
};