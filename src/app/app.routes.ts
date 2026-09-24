import { Routes } from '@angular/router'
import { authGuard } from '../auth/auth.guard'
import { inject } from '@angular/core'
import { MsalService, MsalBroadcastService } from '@azure/msal-angular'
import { Router } from '@angular/router'
import { filter, take, switchMap, of } from 'rxjs'
import { InteractionStatus } from '@azure/msal-browser'

const adminGuard = () => {
  const auth = inject(MsalService)
  const broadcast = inject(MsalBroadcastService)
  const router = inject(Router)

  return broadcast.inProgress$.pipe(
    filter(status => status === InteractionStatus.None),
    take(1),
    switchMap(() => {
      const account = auth.instance.getActiveAccount() ?? auth.instance.getAllAccounts()[0]
      if (!account) {
        router.navigate([''])
        return of(false)
      }
      const roles = (account.idTokenClaims as any)?.roles as string[] ?? []
      if (roles.includes('admin')) return of(true)
      router.navigate(['/forbidden'])
      return of(false)
    })
  )
}

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'pedidos',
    loadComponent: () =>
      import('./pages/pedidos/pedidos.component').then((m) => m.PedidosComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./pages/forbidden/forbidden.component').then((m) => m.ForbiddenComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
]