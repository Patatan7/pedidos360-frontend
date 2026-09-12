import { inject } from '@angular/core'
import { HttpInterceptorFn } from '@angular/common/http'
import { MsalService } from '@azure/msal-angular'
import { from, switchMap } from 'rxjs'
import { environment } from '../environments/environment'
import { loginRequest } from './msal.config'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(MsalService)

  const account =
    authService.instance.getActiveAccount() ??
    authService.instance.getAllAccounts()[0]

  if (!account) return next(req)

  return from(
    authService.instance.acquireTokenSilent({
      ...loginRequest,
      account,
    })
  ).pipe(
    switchMap((result) => {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${result.accessToken}`,
        },
      })
      return next(authReq)
    })
  )
}