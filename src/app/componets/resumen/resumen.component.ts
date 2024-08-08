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
  @ViewChildren('wrapper1, wrapper2, wrapper3, wrapper4, wrapper5, wrapper6, wrapper7, wrapper8') wrapperRefs!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('ticket1, ticket2, ticket3, ticket4, ticket5, ticket6, ticket7, ticket8') ticketRefs!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('card1') cardRefs!: QueryList<ElementRef<HTMLDivElement>>;

  private mobileQuery: MediaQueryList | undefined;
  private mobileListener: (() => void) | undefined;
  private mobileMode = false;

  constructor(
    private renderer: Renderer2,
    private referenciasService: ReferenciasAnimacionesService,
    private habilidadesService: HabilidadesAnimacionesService
  ) {
    if (typeof window !== 'undefined') {
      this.mobileQuery = window.matchMedia('(max-width: 768px)');
      this.mobileListener = () => this.onMediaChange();
      this.mobileQuery.addEventListener('change', this.mobileListener);
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.wrapperRefs.forEach((wrapperRef, index) => {
        const ticketRef = this.ticketRefs.toArray()[index];
        this.referenciasService.addHoverEffectToWrapper(wrapperRef, ticketRef);
      });

      this.cardRefs.forEach((cardRef) => {
        this.habilidadesService.addCardHoverEffect(cardRef);
      });

      this.initializeSocialCards();
      this.onMediaChange(); // Detectamos si estamos en modo móvil
    }
  }

  ngOnDestroy() {
    if (this.mobileQuery && this.mobileListener) {
      this.mobileQuery.removeEventListener('change', this.mobileListener);
    }

    this.referenciasService.clearMobileSubscriptions();
    this.habilidadesService.stopMobileAnimations(this.ticketRefs);
  }

  private onMediaChange() {
    if (this.mobileQuery) {
      this.mobileMode = this.mobileQuery.matches;

      if (this.mobileMode) {
        // Activamos la animación de DVD solo en modo móvil
        this.cardRefs.forEach((cardRef) => {
          this.referenciasService.startDVDLogoAnimation(cardRef);
        });
      } else {
        this.habilidadesService.stopMobileAnimations(this.ticketRefs);
      }
    }
  }

  private showSocial(toggleCardId: string, socialCardId: string) {
    const toggle = this.renderer.selectRootElement(`#${toggleCardId}`, true);
    const socialCard = this.renderer.selectRootElement(`#${socialCardId}`, true);

    if (toggle && socialCard) {
      this.renderer.listen(toggle, 'click', () => {
        const isActive = socialCard.classList.contains('animation');
        if (isActive) {
          this.renderer.removeClass(socialCard, 'animation');
        } else {
          this.renderer.addClass(socialCard, 'animation');
        }
      });
    }
  }

  private initializeSocialCards() {
    this.showSocial('card1-toggle1', 'card1-social1');
    this.showSocial('card1-toggle2', 'card1-social2');
    this.showSocial('card1-toggle3', 'card1-social3');
    console.log('Social cards initialized');
  }
}
