import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { type IPublicClientApplication } from '@azure/msal-browser'
import {
  MSAL_INSTANCE,
  MsalBroadcastService,
  MsalService,
} from '@azure/msal-angular'
import { routes } from './app.routes'
import { authInterceptor } from '../auth/auth.interceptor'

const browserProviders = [
  provideBrowserGlobalErrorListeners(),
  provideRouter(routes),
  provideHttpClient(withInterceptors([authInterceptor])),
]

export const appConfig: ApplicationConfig = {
  providers: [...browserProviders],
}

export function getMsalAppConfig(msalInstance: IPublicClientApplication): ApplicationConfig {
  return {
    providers: [
      ...browserProviders,
      {
        provide: MSAL_INSTANCE,
        useValue: msalInstance,
      },
      MsalService,
      MsalBroadcastService,
    ],
  }
}