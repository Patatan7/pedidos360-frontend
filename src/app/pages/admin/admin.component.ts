import { Component, inject, OnInit, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DatePipe } from '@angular/common'
import { PedidoService, Pedido } from '../../services/pedido.service'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  imports: [FormsModule, DatePipe],
})
export class AdminComponent implements OnInit {
  private readonly service = inject(PedidoService)

  readonly pedidos = signal<Pedido[]>([])
  readonly loading = signal(false)
  readonly error = signal<string | null>(null)
  readonly editando = signal<Pedido | null>(null)

  ngOnInit(): void {
    this.cargar()
  }

  cargar(): void {
    this.loading.set(true)
    this.service.todos().subscribe({
      next: (data) => { this.pedidos.set(data); this.loading.set(false) },
      error: () => { this.error.set('Error al cargar pedidos'); this.loading.set(false) },
    })
  }

  editar(p: Pedido): void {
    this.editando.set({ ...p })
  }

  cancelarEdicion(): void {
    this.editando.set(null)
  }

  guardar(): void {
    const p = this.editando()
    if (!p || !p.id) return
    this.service.actualizar(p.id, p).subscribe({
      next: (actualizado) => {
        this.pedidos.update(list => list.map(x => x.id === actualizado.id ? actualizado : x))
        this.editando.set(null)
      },
      error: () => this.error.set('Error al actualizar pedido'),
    })
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este pedido?')) return
    this.service.eliminar(id).subscribe({
      next: () => this.pedidos.update(list => list.filter(x => x.id !== id)),
      error: () => this.error.set('Error al eliminar pedido'),
    })
  }
}