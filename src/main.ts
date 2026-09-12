import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig, msalAppConfig } from './app/app.config'
import { AppComponent } from './app/app'
import { isAuthConfigured } from './auth/msal.config'

bootstrapApplication(AppComponent, isAuthConfigured ? msalAppConfig : appConfig).catch(
  (err) => console.error(err),
)