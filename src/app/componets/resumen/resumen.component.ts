
import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { ReferenciasAnimacionesService } from './referencias/referencias-animaciones.service';
import { HabilidadesAnimacionesService } from './habilidades/habilidades-animaciones.service';

@Component({
  selector: 'app-resumen',
  standalone: true,
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements AfterViewInit, OnDestroy {
  // Referencias a los elementos del DOM con las IDs especificadas
  @ViewChildren('wrapper1, wrapper2, wrapper3, wrapper4, wrapper5, wrapper6, wrapper7, wrapper8') wrapperRefs!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('ticket1, ticket2, ticket3, ticket4, ticket5, ticket6, ticket7, ticket8') ticketRefs!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('card1') cardRefs!: QueryList<ElementRef<HTMLDivElement>>;

  // Variables para manejar la detección de tamaño de pantalla
  private mobileQuery: MediaQueryList | undefined;
  private mobileListener: (() => void) | undefined;
  private mobileMode = false;

  constructor(
    private renderer: Renderer2,
    private referenciasService: ReferenciasAnimacionesService,
    private habilidadesService: HabilidadesAnimacionesService
  ) {
    // Constructor: Configura el media query para detectar el tamaño de la pantalla
    if (typeof window !== 'undefined') {
      this.mobileQuery = window.matchMedia('(max-width: 768px)');
      this.mobileListener = () => this.onMediaChange();
      this.mobileQuery.addEventListener('change', this.mobileListener);
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      // Recorre los elementos y aplica efectos de hover usando el servicio `ReferenciasAnimacionesService`
      this.wrapperRefs.forEach((wrapperRef, index) => {
        const ticketRef = this.ticketRefs.toArray()[index];
        this.referenciasService.addHoverEffectToWrapper(wrapperRef, ticketRef);
      });

      // Aplica efectos de hover a las tarjetas usando el servicio `HabilidadesAnimacionesService`
      this.cardRefs.forEach((cardRef) => {
        this.habilidadesService.addCardHoverEffect(cardRef);
      });

      // Inicializa las tarjetas sociales (agrega efectos de animación)
      this.initializeSocialCards();

      // Verifica el estado inicial del media query y ajusta las animaciones en consecuencia
      this.onMediaChange();
    }
  }

  ngOnDestroy() {
    // Remueve el listener del media query cuando el componente se destruye
    if (this.mobileQuery && this.mobileListener) {
      this.mobileQuery.removeEventListener('change', this.mobileListener);
    }

    // Limpia las suscripciones a eventos móviles en el servicio `ReferenciasAnimacionesService`
    this.referenciasService.clearMobileSubscriptions();

    // Detiene las animaciones móviles usando el servicio `HabilidadesAnimacionesService`
    this.habilidadesService.stopMobileAnimations(this.ticketRefs);
  }

  // Método para manejar los cambios en el tamaño de la pantalla
  private onMediaChange() {
    if (this.mobileQuery) {
      this.mobileMode = this.mobileQuery.matches; // Verifica si estamos en modo móvil
      // Inicia o detiene animaciones basadas en el modo (móvil o no)
      this.mobileMode ? this.habilidadesService.startMobileAnimations(this.wrapperRefs, this.ticketRefs) : this.habilidadesService.stopMobileAnimations(this.ticketRefs);
    }
  }

  // Método para manejar la visualización de las tarjetas sociales con animación
  private showSocial(toggleCardId: string, socialCardId: string) {
    // Selecciona los elementos del DOM basados en las IDs proporcionadas
    const toggle = this.renderer.selectRootElement(`#${toggleCardId}`, true);
    const socialCard = this.renderer.selectRootElement(`#${socialCardId}`, true);

    // Si los elementos existen, agrega un listener para manejar los clics
    if (toggle && socialCard) {
      this.renderer.listen(toggle, 'click', () => {
        const isActive = socialCard.classList.contains('animation');
        // Alterna la clase de animación en función de su estado actual
        if (isActive) {
          this.renderer.removeClass(socialCard, 'animation');
        } else {
          this.renderer.addClass(socialCard, 'animation');
        }
      });
    }
  }

  // Método para inicializar todas las tarjetas sociales con sus respectivos toggles
  private initializeSocialCards() {
    this.showSocial('card1-toggle1', 'card1-social1');
    this.showSocial('card1-toggle2', 'card1-social2');
    this.showSocial('card1-toggle3', 'card1-social3');
    console.log('Social cards initialized'); // Registro en la consola para confirmar la inicialización
  }
} 
