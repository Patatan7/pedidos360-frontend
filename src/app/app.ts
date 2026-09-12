import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MsalBroadcastService, MsalService } from '@azure/msal-angular'
import { InteractionStatus } from '@azure/msal-browser'
import { filter } from 'rxjs/operators'
import { isAuthConfigured } from '../auth/msal.config'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef)
  private readonly authService = inject(MsalService, { optional: true })
  private readonly msalBroadcast = inject(MsalBroadcastService, { optional: true })

  readonly isAuthConfigured = isAuthConfigured
  readonly loggedIn = signal(false)

  ngOnInit(): void {
    if (!this.authService || !this.msalBroadcast) return

    this.authService.handleRedirectObservable().subscribe()

    this.msalBroadcast.inProgress$
      .pipe(
        filter((status) => status === InteractionStatus.None),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        const accounts = this.authService!.instance.getAllAccounts()
        if (accounts.length > 0 && !this.authService!.instance.getActiveAccount()) {
          this.authService!.instance.setActiveAccount(accounts[0])
        }
        this.loggedIn.set(accounts.length > 0)
      })
  }
}