import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ElementRef, QueryList } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferenciasAnimacionesService {
  // Arreglo para almacenar las suscripciones a eventos, para poder limpiarlas luego
  private mobileSubscriptions: Subscription[] = [];
  private renderer: Renderer2;
  private dvdAnimationSubscription: Subscription | null = null;


  constructor(rendererFactory: RendererFactory2) {
    // Inicializa el renderer, que permite manipular elementos del DOM de manera segura
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // Método para agregar efectos de hover a los elementos
  addHoverEffectToWrapper(wrapperRef: ElementRef<HTMLDivElement>, ticketRef: ElementRef<HTMLDivElement>) {
    const wrapper = wrapperRef.nativeElement; // Obtiene el elemento nativo del wrapper
    const ticket = ticketRef.nativeElement; // Obtiene el elemento nativo del ticket

    // Suscripción al evento de movimiento del ratón dentro del wrapper
    const mouseMove$ = fromEvent<MouseEvent>(wrapper, 'mousemove').subscribe(event => this.onMouseMove(event, wrapper, ticket));
    // Suscripción al evento de salida del ratón del wrapper
    const mouseLeave$ = fromEvent(wrapper, 'mouseleave').subscribe(() => this.onMouseLeave(ticket));

    // Almacena las suscripciones para poder limpiarlas más tarde
    this.mobileSubscriptions.push(mouseMove$, mouseLeave$);
  }

  // Método para manejar el movimiento del ratón y aplicar transformaciones
  private onMouseMove(event: MouseEvent, wrapper: HTMLDivElement, ticket: HTMLDivElement) {
    // Obtiene el tamaño del wrapper
    const { width, height } = wrapper.getBoundingClientRect();
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    // Calcula las rotaciones en los ejes X e Y basadas en la posición del ratón
    const rotationX = ((event.offsetX - halfWidth) / halfWidth) * 30;
    const rotationY = ((event.offsetY - halfHeight) / halfHeight) * 30;

    // Aplica la transformación de rotación al ticket
    ticket.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    ticket.style.transition = 'transform 0.3s'; // Aplica una transición suave para la transformación
  }

  // Método para manejar cuando el ratón sale del wrapper, restableciendo la rotación
  private onMouseLeave(ticket: HTMLDivElement) {
    ticket.style.transform = 'rotateX(0deg) rotateY(0deg)'; // Restablece la transformación al estado inicial
  }

  // Método para limpiar todas las suscripciones a eventos móviles
  clearMobileSubscriptions() {
    this.mobileSubscriptions.forEach(sub => sub.unsubscribe()); // Cancela cada suscripción
    this.mobileSubscriptions = []; // Limpia el arreglo de suscripciones
  }
}
