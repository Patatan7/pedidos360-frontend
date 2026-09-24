import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'

export interface Pedido {
  id?: number
  descripcion: string
  estado?: string
  usuarioOid?: string
  fechaCreacion?: string
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly http = inject(HttpClient)
  private readonly base = `${environment.apiUrl}/api/pedidos`

  misPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.base}/mis-pedidos`)
  }

  todos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.base)
  }

  crear(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.base, pedido)
  }

  actualizar(id: number, pedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.base}/${id}`, pedido)
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`)
  }

  obtenerPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.base}/${id}`)
  }

  cancelar(id: number): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.base}/${id}/cancelar`, {})
  }
}