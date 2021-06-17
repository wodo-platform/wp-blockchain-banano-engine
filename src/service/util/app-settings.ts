export type WalletStore = 'localStorage'|'database'|'none';
export type PoWSource = 'server'|'clientCPU'|'clientWebGL'|'best';


export interface AppSettings {
    displayDenomination: string;
    // displayPrefix: string | null;
    walletStore: string;
    displayCurrency: string;
    defaultRepresentative: string | null;
    lockOnClose: number;
    lockInactivityMinutes: number;
    powSource: PoWSource;
    serverName: string;
    serverAPI: string | null;
    serverNode: string | null;
    serverWS: string | null;
    minimumReceive: string | null;
  }