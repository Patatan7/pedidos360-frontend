import { Component, inject, OnInit, signal } from '@angular/core'
import { Router } from '@angular/router'
import { MsalService } from '@azure/msal-angular'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(MsalService)
  private readonly router = inject(Router)

  readonly username = signal('')
  readonly isAdmin = signal(false)

  ngOnInit(): void {
    const account =
      this.authService.instance.getActiveAccount() ??
      this.authService.instance.getAllAccounts()[0]

    if (!account) {
      this.router.navigate(['/'])
      return
    }

    this.username.set(account.name ?? account.username)

    const roles = (account.idTokenClaims as any)?.roles as string[] ?? []
    this.isAdmin.set(roles.includes('admin'))
  }

  irAPedidos(): void {
    this.router.navigate(['/pedidos'])
  }

  irAAdmin(): void {
    this.router.navigate(['/admin'])
  }

  signOut(): void {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: environment.redirectUri,
    }).subscribe()
  }
}