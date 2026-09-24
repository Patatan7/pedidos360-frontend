import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.css',
})
export class ForbiddenComponent {
  private readonly router = inject(Router)

  volver(): void {
    this.router.navigate(['/dashboard'])
  }
}