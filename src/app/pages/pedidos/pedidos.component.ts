import { Component, inject, OnInit, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DatePipe } from '@angular/common'
import { PedidoService, Pedido } from '../../services/pedido.service'

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',
  imports: [FormsModule, DatePipe],
})
export class PedidosComponent implements OnInit {
  private readonly service = inject(PedidoService)

  readonly pedidos = signal<Pedido[]>([])
  readonly loading = signal(false)
  readonly error = signal<string | null>(null)
  readonly nuevaDescripcion = signal('')

  ngOnInit(): void {
    this.cargar()
  }

  cargar(): void {
    this.loading.set(true)
    this.service.misPedidos().subscribe({
      next: (data) => { this.pedidos.set(data); this.loading.set(false) },
      error: () => { this.error.set('Error al cargar pedidos'); this.loading.set(false) },
    })
  }

  crear(): void {
    const desc = this.nuevaDescripcion().trim()
    if (!desc) return
    this.service.crear({ descripcion: desc }).subscribe({
      next: (p) => {
        this.pedidos.update(list => [...list, p])
        this.nuevaDescripcion.set('')
      },
      error: () => this.error.set('Error al crear pedido'),
    })
  }
}