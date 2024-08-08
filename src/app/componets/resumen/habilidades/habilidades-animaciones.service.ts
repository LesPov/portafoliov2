import { Injectable, RendererFactory2 } from '@angular/core';
import { ElementRef, QueryList, Renderer2 } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabilidadesAnimacionesService {
  private mobileMode = false;
  private mobileIntervals: any[] = [];
  private mobileSubscriptions: Subscription[] = [];
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  randomMove(wrapperRef: ElementRef<HTMLDivElement>, ticketRef: ElementRef<HTMLDivElement>) {
    const ticket = ticketRef.nativeElement;
    const rotationX = (Math.random() - 0.5) * 60;
    const rotationY = (Math.random() - 0.5) * 60;
    ticket.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`; // Aplica una rotación aleatoria
    ticket.style.transition = 'transform 0.3s'; // Aplica una transición suave
  }

  startMobileAnimations(wrapperRefs: QueryList<ElementRef<HTMLDivElement>>, ticketRefs: QueryList<ElementRef<HTMLDivElement>>) {
    wrapperRefs.forEach((wrapperRef, index) => {
      const ticketRef = ticketRefs.toArray()[index];
      const intervalId = setInterval(() => {
        this.randomMove(wrapperRef, ticketRef);
      }, 1000);
      this.mobileIntervals.push(intervalId); // Almacena los intervalos para poder limpiarlos posteriormente
    });
  }

  stopMobileAnimations(ticketRefs: QueryList<ElementRef<HTMLDivElement>>) {
    this.clearMobileIntervals(); // Limpia los intervalos de animaciones
    this.resetPositions(ticketRefs); // Restablece las posiciones de los tickets
  }

  private clearMobileIntervals() {
    this.mobileIntervals.forEach(intervalId => clearInterval(intervalId));
    this.mobileIntervals = [];
  }

  private resetPositions(ticketRefs: QueryList<ElementRef<HTMLDivElement>>) {
    ticketRefs.forEach((ticketRef) => {
      const ticket = ticketRef.nativeElement;
      ticket.style.transform = 'rotateX(0deg) rotateY(0deg)'; // Restablece la rotación
      ticket.style.transition = 'transform 0.3s'; // Aplica una transición suave
    });
  }

  addCardHoverEffect(cardRef: ElementRef<HTMLDivElement>) {
    const card = cardRef.nativeElement;

    // Suscripción al evento de movimiento del ratón dentro de la tarjeta
    const mouseMove$ = fromEvent<MouseEvent>(card, 'mousemove').subscribe(event => this.onCardMouseMove(event, card));
    // Suscripción al evento de salida del ratón de la tarjeta
    const mouseLeave$ = fromEvent(card, 'mouseleave').subscribe(() => this.onCardMouseLeave(card));

    this.mobileSubscriptions.push(mouseMove$, mouseLeave$); // Almacena las suscripciones para su limpieza posterior
  }

  private onCardMouseMove(event: MouseEvent, card: HTMLDivElement) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Ajusta las coordenadas X e Y dentro de la tarjeta usando propiedades CSS personalizadas
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  }

  private onCardMouseLeave(card: HTMLDivElement) {
    card.style.setProperty('--x', `50%`); // Restablece la posición X al centro
    card.style.setProperty('--y', `50%`); // Restablece la posición Y al centro
  }

  showSocial(toggleCardId: string, socialCardId: string, renderer: Renderer2) {
    // Accede a los elementos usando Renderer2 para manipulación segura del DOM
    const toggle = renderer.selectRootElement(`#${toggleCardId}`);
    const socialCard = renderer.selectRootElement(`#${socialCardId}`);
    renderer.listen(toggle, 'mouseover', () => renderer.setStyle(socialCard, 'display', 'block'));
    renderer.listen(toggle, 'mouseout', () => renderer.setStyle(socialCard, 'display', 'none'));
  }
}