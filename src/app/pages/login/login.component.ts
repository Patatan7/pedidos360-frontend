import { Component, inject, OnInit, signal } from '@angular/core'
import { Router } from '@angular/router'
import { MsalService } from '@azure/msal-angular'
import { loginRequest } from '../../../auth/msal.config'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(MsalService)
  private readonly router = inject(Router)

  readonly loading = signal(false)

  ngOnInit(): void {
    const accounts = this.authService.instance.getAllAccounts()
    if (accounts.length > 0) {
      this.router.navigate(['/dashboard'])
    }
  }

  signIn(): void {
    this.loading.set(true)
    this.authService.loginRedirect(loginRequest).subscribe({
      error: () => this.loading.set(false),
    })
  }
}