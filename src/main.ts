import { bootstrapApplication } from '@angular/platform-browser'
import { AppComponent } from './app/app'
import { isAuthConfigured } from './auth/msal.config'
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from './auth/msal.config'
import { appConfig, getMsalAppConfig } from './app/app.config'

async function bootstrap() {
  if (isAuthConfigured) {
    const msalInstance = new PublicClientApplication(msalConfig)
    await msalInstance.initialize()
    await msalInstance.handleRedirectPromise()
    bootstrapApplication(AppComponent, getMsalAppConfig(msalInstance)).catch(err => console.error(err))
  } else {
    bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err))
  }
}

bootstrap()