import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import {
  type IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser'
import {
  MSAL_INSTANCE,
  MsalBroadcastService,
  MsalService,
} from '@azure/msal-angular'
import { msalConfig } from '../auth/msal.config'
import { routes } from './app.routes'
import { authInterceptor } from '../auth/auth.interceptor'

const browserProviders = [
  provideBrowserGlobalErrorListeners(),
  provideRouter(routes),
  provideHttpClient(withInterceptors([authInterceptor])),
]

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig)
}

export const appConfig: ApplicationConfig = {
  providers: [...browserProviders],
}

export const msalAppConfig: ApplicationConfig = {
  providers: [
    ...browserProviders,
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    MsalService,
    MsalBroadcastService,
  ],
}