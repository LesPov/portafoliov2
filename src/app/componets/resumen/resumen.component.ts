import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-resumen',
  standalone: true,
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements AfterViewInit, OnDestroy {
  // Referencias a elementos HTML con las clases 'wrapper' y 'ticket'
  @ViewChildren('wrapper1, wrapper2, wrapper3, wrapper4, wrapper5, wrapper6, wrapper7, wrapper8') wrapperRefs!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('ticket1, ticket2, ticket3, ticket4, ticket5, ticket6, ticket7, ticket8') ticketRefs!: QueryList<ElementRef<HTMLDivElement>>;

  // Referencia a elementos HTML con la clase 'card1'
  @ViewChildren('card1') cardRefs!: QueryList<ElementRef<HTMLDivElement>>;

  // Variables privadas para manejar el estado de la aplicación
  private mobileQuery: MediaQueryList | undefined;
  private mobileListener: (() => void) | undefined;
  private mobileMode = false; // Indica si está en modo móvil
  private subscriptions: Subscription[] = []; // Suscripciones a eventos
  private animationIntervals: any[] = []; // Intervalos de animación para móviles

  constructor() {
    // Si el objeto window está disponible, se configura el media query para detectar cambios en el tamaño de la pantalla
    if (typeof window !== 'undefined') {
      this.mobileQuery = window.matchMedia('(max-width: 768px)');
      this.mobileListener = () => this.onMediaChange(); // Listener para cambios en el media query
      this.mobileQuery.addEventListener('change', this.mobileListener); // Se añade el listener al media query
    }
  }

  ngAfterViewInit() {
    // Se ejecuta una vez que la vista ha sido inicializada
    if (typeof window !== 'undefined') {
      this.initializeHoverEffects(); // Inicializa los efectos de hover
      this.initializeSocialCards(); // Inicializa las tarjetas sociales
      this.initializeHandAnimation(); // Inicia la animación de la mano

      this.onMediaChange(); // Verifica el estado inicial del media query
    }
  }

  ngOnDestroy() {
    // Se ejecuta antes de que el componente sea destruido
    if (this.mobileQuery && this.mobileListener) {
      this.mobileQuery.removeEventListener('change', this.mobileListener); // Remueve el listener de cambios en el media query
    }
    this.clearIntervals(); // Limpia los intervalos de animación
    this.clearSubscriptions(); // Cancela todas las suscripciones a eventos
  }

  // ============================
  // Sección: Efectos de Hover
  // ============================

  /**
   * Inicializa los efectos de hover para los elementos 'wrapper' y 'card1'.
   */
  private initializeHoverEffects() {
    this.wrapperRefs.forEach((wrapperRef, index) => {
      const ticketRef = this.ticketRefs.toArray()[index]; // Obtiene la referencia correspondiente al ticket
      this.addHoverEffect(wrapperRef.nativeElement, ticketRef.nativeElement); // Añade el efecto de hover al wrapper y su ticket asociado
    });

    this.cardRefs.forEach((cardRef) => {
      this.addHoverEffect(cardRef.nativeElement); // Añade el efecto de hover a las tarjetas sociales
    });
  }

  /**
   * Añade un efecto de hover a un elemento HTML.
   * @param element El elemento HTML al que se añadirá el efecto de hover.
   * @param ticket (Opcional) Un elemento HTML secundario que rotará en función de la posición del mouse.
   */
  private addHoverEffect(element: HTMLDivElement, ticket?: HTMLDivElement) {
    const mouseMove$ = fromEvent<MouseEvent>(element, 'mousemove').subscribe(event => {
      if (this.mobileMode) return; // No aplica el efecto en modo móvil

      if (ticket) {
        // Rotación 3D de los tickets en función de la posición del mouse
        const { width, height } = element.getBoundingClientRect();
        const rotationX = ((event.offsetX - width / 2) / width) * 35;
        const rotationY = ((event.offsetY - height / 2) / height) * 35;

        ticket.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      } else {
        // Movimiento del gradiente de fondo en las tarjetas sociales
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        element.style.setProperty('--x', `${x}px`);
        element.style.setProperty('--y', `${y}px`);
      }
    });

    const mouseLeave$ = fromEvent(element, 'mouseleave').subscribe(() => {
      if (ticket) {
        // Reseteo de la rotación al salir el mouse
        ticket.style.transform = 'rotateX(0deg) rotateY(0deg)';
      } else {
        // Reseteo de la posición del gradiente al centro
        element.style.setProperty('--x', `50%`);
        element.style.setProperty('--y', `50%`);
      }
    });

    this.subscriptions.push(mouseMove$, mouseLeave$); // Almacena las suscripciones para su posterior cancelación
  }

  // ==========================
  // Sección: Tarjetas Sociales
  // ==========================

  /**
   * Inicializa los eventos de clic para las tarjetas sociales, vinculando botones a sus respectivas tarjetas.
   */
  private initializeSocialCards() {
    ['card1-toggle1', 'card1-toggle2', 'card1-toggle3'].forEach((toggleId, index) => {
      const socialId = `card1-social${index + 1}`;
      const toggleElement = document.getElementById(toggleId);
      const socialElement = document.getElementById(socialId);

      if (toggleElement && socialElement) {
        this.subscriptions.push(fromEvent(toggleElement, 'click').subscribe(() => this.toggleSocialCard(socialElement)));
      }
    });
  }

  /**
   * Alterna la animación de una tarjeta social al hacer clic.
   * @param socialElement El elemento de la tarjeta social que se alternará.
   */
  private toggleSocialCard(socialElement: HTMLElement) {
    if (socialElement.classList.contains('animation')) {
      socialElement.classList.add('down-animation'); // Añade la animación de bajar si la tarjeta ya está animada
      setTimeout(() => socialElement.classList.remove('down-animation'), 1000); // Remueve la animación de bajar después de 1 segundo
    }
    socialElement.classList.toggle('animation'); // Alterna la animación principal
  }

  // ==========================
  // Sección: Animaciones Móviles
  // ==========================

  /**
   * Inicia una animación de rebote para un elemento HTML (simulando el logo de DVD rebotando).
   * @param card El elemento HTML al que se le aplicará la animación.
   */
  private startBouncingAnimation(card: HTMLDivElement) {
    let x = 50, y = 50; // Posiciones iniciales de la animación
    let dx = 1, dy = 1; // Dirección del movimiento

    const move = () => {
      const rect = card.getBoundingClientRect();

      // Invierte la dirección si se alcanza un borde
      if (x <= 0 || x >= rect.width) dx = -dx;
      if (y <= 0 || y >= rect.height) dy = -dy;

      x += dx;
      y += dy;

      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    };

    const intervalId = setInterval(move, 10); // Crea un intervalo que mueve la tarjeta cada 10ms
    this.animationIntervals.push(intervalId); // Almacena el ID del intervalo para su posterior limpieza
  }

  /**
   * Inicia las animaciones específicas para el modo móvil.
   */
  private startMobileAnimations() {
    // Inicia la animación de rebote para cada tarjeta social
    this.cardRefs.forEach((cardRef) => this.startBouncingAnimation(cardRef.nativeElement));

    // Inicia el movimiento aleatorio de los tickets
    this.wrapperRefs.forEach((wrapperRef, index) => {
      const ticketRef = this.ticketRefs.toArray()[index];
      const intervalId = setInterval(() => this.randomMove(ticketRef.nativeElement), 1000);
      this.animationIntervals.push(intervalId); // Almacena el ID del intervalo para su posterior limpieza
    });
  }

  /**
   * Aplica un movimiento de rotación aleatorio a un elemento de ticket.
   * @param ticket El elemento HTML del ticket que se moverá.
   */
  private randomMove(ticket: HTMLDivElement) {
    const rotationX = (Math.random() - 0.5) * 60;
    const rotationY = (Math.random() - 0.5) * 60;
    ticket.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`; // Aplica una rotación aleatoria
  }

  /**
   * Detiene todas las animaciones móviles y resetea las posiciones de los elementos.
   */
  private stopMobileAnimations() {
    this.clearIntervals(); // Limpia todos los intervalos de animación
    this.resetPositions(); // Resetea las posiciones de los elementos animados
  }

  // ==============================
  // Sección: Animación del Icono de Mano
  // ==============================

/**
 * Inicializa la animación del ícono de la mano, que hace que la mano se mueva hacia arriba y hacia abajo.
 */
private initializeHandAnimation() {
  // Itera a través de cada tarjeta para aplicar la animación
  this.cardRefs.forEach((cardRef, index) => {
    const handElement = document.getElementById(`hand${index + 1}`);
    const clickableSection = document.getElementById(`clickableSection${index + 1}`);
    const card1 = cardRef.nativeElement;

    if (handElement && clickableSection && card1) {
      // Maneja la animación al entrar y salir del área clickable
      const mouseEnter$ = fromEvent(clickableSection, 'mouseenter').subscribe(() => {
        handElement.classList.remove('hidden');
        handElement.style.animation = 'click-animation 1.5s infinite ease-in-out';
      });

      const mouseLeave$ = fromEvent(clickableSection, 'mouseleave').subscribe(() => {
        handElement.style.animation = 'none';
      });

      // Maneja el clic en la sección clickable
      const click$ = fromEvent(clickableSection, 'click').subscribe(() => {
        handElement.classList.add('hidden'); // Ocultar la mano después de hacer clic
      });

      // Maneja el clic fuera de la tarjeta card1 para mostrar la mano nuevamente
      const documentClick$ = fromEvent(document, 'click').subscribe((event: Event) => {
        if (!card1.contains(event.target as Node)) {
          // Resetear la animación eliminando y volviendo a agregar la clase
          handElement.classList.remove('hidden');
          setTimeout(() => {
            handElement.style.animation = ''; // Reiniciar la animación
          }, 2); // Un pequeño retraso para asegurar que se reinicie
        }
      });

      this.subscriptions.push(mouseEnter$, mouseLeave$, click$, documentClick$);
    }
  });
}





  // ==============================
  // Sección: Utilidades y Limpieza
  // ==============================

  /**
   * Maneja los cambios en el tamaño de la pantalla, activando o desactivando animaciones según el modo.
   */
  private onMediaChange() {
    if (this.mobileQuery && this.mobileQuery.matches) {
      if (!this.mobileMode) {
        this.mobileMode = true;
        this.stopMobileAnimations(); // Detiene animaciones previas antes de iniciar nuevas
        this.startMobileAnimations(); // Inicia las animaciones específicas para móviles
      }
    } else {
      if (this.mobileMode) {
        this.mobileMode = false;
        this.stopMobileAnimations(); // Detiene todas las animaciones móviles
      }
    }
  }

  /**
   * Limpia todos los intervalos de animación activos.
   */
  private clearIntervals() {
    this.animationIntervals.forEach(intervalId => clearInterval(intervalId)); // Limpia cada intervalo usando su ID
    this.animationIntervals = []; // Resetea el array de intervalos
  }

  /**
   * Cancela todas las suscripciones a eventos.
   */
  private clearSubscriptions() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe()); // Cancela cada suscripción
    this.subscriptions = []; // Resetea el array de suscripciones
  }

  /**
   * Resetea las posiciones de todos los elementos animados a sus valores originales.
   */
  private resetPositions() {
    this.cardRefs.forEach(cardRef => {
      cardRef.nativeElement.style.setProperty('--x', `50%`);
      cardRef.nativeElement.style.setProperty('--y', `50%`);
    });

    this.ticketRefs.forEach(ticketRef => {
      ticketRef.nativeElement.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }
}
