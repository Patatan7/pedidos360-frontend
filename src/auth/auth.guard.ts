import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { MsalService } from '@azure/msal-angular'

export const authGuard: CanActivateFn = () => {
  const authService = inject(MsalService)
  const router = inject(Router)

  const account =
    authService.instance.getActiveAccount() ??
    authService.instance.getAllAccounts()[0]

  if (account) return true

  router.navigate(['/'])
  return false
}