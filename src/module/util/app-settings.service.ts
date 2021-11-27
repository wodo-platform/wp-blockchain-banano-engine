import { Injectable } from '@nestjs/common';
import { AppSettings } from './app-settings';

@Injectable()
export class AppSettingsService {
  storeKey = `bananovault-appsettings`;

  settings: AppSettings = {
    displayDenomination: 'banano',
    // displayPrefix: 'xrb',
    walletStore: 'localStorage',
    displayCurrency: 'USD',
    defaultRepresentative: null,
    lockOnClose: 1,
    lockInactivityMinutes: 30,
    powSource: 'best',
    serverName: 'bananovault',
    serverAPI: null,
    serverNode: null,
    serverWS: null,
    minimumReceive: null,
  };

  constructor() { }

  loadAppSettings() {
    let settings: AppSettings = this.settings;
    /*const settingsStore = localStorage.getItem(this.storeKey);
    if (settingsStore) {
      settings = JSON.parse(settingsStore);
    }*/
    this.settings = Object.assign(this.settings, settings);

    return this.settings;
  }

  saveAppSettings() {
    //localStorage.setItem(this.storeKey, JSON.stringify(this.settings));
  }

  getAppSetting(key) {
    return this.settings[key] || null;
  }

  setAppSetting(key, value) {
    this.settings[key] = value;
    this.saveAppSettings();
  }

  setAppSettings(settingsObject) {
    for (let key in settingsObject) {
      if (!settingsObject.hasOwnProperty(key)) continue;
      this.settings[key] = settingsObject[key];
    }

    this.saveAppSettings();
  }

  clearAppSettings() {
    //localStorage.removeItem(this.storeKey);
    this.settings = {
      displayDenomination: 'banano',
      // displayPrefix: 'xrb',
      walletStore: 'database',
      displayCurrency: 'USD',
      defaultRepresentative: null,
      lockOnClose: 1,
      lockInactivityMinutes: 30,
      powSource: 'best',
      serverName: 'bananovault',
      serverNode: null,
      serverAPI: null,
      serverWS: null,
      minimumReceive: null,
    };
  }

}