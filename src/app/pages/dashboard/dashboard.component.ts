import { Component, inject, OnInit, signal } from '@angular/core'
import { Router } from '@angular/router'
import { MsalService } from '@azure/msal-angular'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(MsalService)
  private readonly router = inject(Router)
  private readonly http = inject(HttpClient)

  readonly username = signal('')
  readonly apiResponse = signal<string | null>(null)
  readonly loading = signal(false)

  ngOnInit(): void {
    const account =
      this.authService.instance.getActiveAccount() ??
      this.authService.instance.getAllAccounts()[0]

    if (!account) {
      this.router.navigate(['/'])
      return
    }

    this.username.set(account.name ?? account.username)
  }

  testPublicApi(): void {
    this.loading.set(true)
    this.http.get(`${environment.apiUrl}/public/hola`).subscribe({
      next: (res) => {
        this.apiResponse.set(JSON.stringify(res, null, 2))
        this.loading.set(false)
      },
      error: (err) => {
        this.apiResponse.set(`Error: ${err.message}`)
        this.loading.set(false)
      },
    })
  }

  testPrivateApi(): void {
    this.loading.set(true)
    this.http.get(`${environment.apiUrl}/api/me`).subscribe({
      next: (res) => {
        this.apiResponse.set(JSON.stringify(res, null, 2))
        this.loading.set(false)
      },
      error: (err) => {
        this.apiResponse.set(`Error: ${err.status} - ${err.message}`)
        this.loading.set(false)
      },
    })
  }

  signOut(): void {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: environment.redirectUri,
    }).subscribe()
  }
}