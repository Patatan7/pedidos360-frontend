import { Component, inject, OnInit, signal, computed } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router'
import { PedidoService, Pedido } from '../../services/pedido.service'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  imports: [FormsModule, DatePipe],
})
export class AdminComponent implements OnInit {
  private readonly service = inject(PedidoService)
  private readonly router = inject(Router)

  readonly pedidos = signal<Pedido[]>([])
  readonly loading = signal(false)
  readonly error = signal<string | null>(null)
  readonly exito = signal<string | null>(null)
  readonly editando = signal<Pedido | null>(null)
  readonly filtro = signal<string>('TODOS')
  readonly paginaActual = signal(1)
  readonly porPagina = 5

  readonly pedidosFiltrados = computed(() => {
    const f = this.filtro()
    return f === 'TODOS'
      ? this.pedidos()
      : this.pedidos().filter(p => p.estado === f)
  })

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.pedidosFiltrados().length / this.porPagina))
  )

  readonly pedidosPagina = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.porPagina
    return this.pedidosFiltrados().slice(inicio, inicio + this.porPagina)
  })

  readonly paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  )

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

  setFiltro(f: string): void {
    this.filtro.set(f)
    this.paginaActual.set(1)
  }

  setPagina(p: number): void {
    this.paginaActual.set(p)
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
        this.exito.set('Pedido actualizado correctamente.')
        setTimeout(() => this.exito.set(null), 3000)
      },
      error: () => this.error.set('Error al actualizar pedido'),
    })
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este pedido?')) return
    this.service.eliminar(id).subscribe({
      next: () => {
        this.pedidos.update(list => list.filter(x => x.id !== id))
        this.exito.set('Pedido eliminado.')
        setTimeout(() => this.exito.set(null), 3000)
      },
      error: () => this.error.set('Error al eliminar pedido'),
    })
  }

  volver(): void {
    this.router.navigate(['/dashboard'])
  }
}