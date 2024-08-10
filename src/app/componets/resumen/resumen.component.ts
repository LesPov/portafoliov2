import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

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
  private subscriptions: Subscription[] = [];
  private animationIntervals: any[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.mobileQuery = window.matchMedia('(max-width: 768px)');
      this.mobileListener = () => this.onMediaChange();
      this.mobileQuery.addEventListener('change', this.mobileListener);
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.initializeHoverEffects(); // Unifica la inicialización de efectos de hover
      this.initializeSocialCards(); // Inicializa las tarjetas sociales
      this.onMediaChange(); // Verifica el estado inicial del media query
    }
  }

  ngOnDestroy() {
    if (this.mobileQuery && this.mobileListener) {
      this.mobileQuery.removeEventListener('change', this.mobileListener);
    }
    this.clearIntervals();
    this.clearSubscriptions();
  }

  // ============================
  // Sección: Efectos de Hover
  // ============================

  private initializeHoverEffects() {
    this.wrapperRefs.forEach((wrapperRef, index) => {
      const ticketRef = this.ticketRefs.toArray()[index];
      this.addHoverEffect(wrapperRef.nativeElement, ticketRef.nativeElement);
    });

    this.cardRefs.forEach((cardRef) => {
      this.addHoverEffect(cardRef.nativeElement);
    });
  }

  private addHoverEffect(element: HTMLDivElement, ticket?: HTMLDivElement) {
    const mouseMove$ = fromEvent<MouseEvent>(element, 'mousemove').subscribe(event => {
      if (this.mobileMode) return;

      if (ticket) {
        const { width, height } = element.getBoundingClientRect();
        const rotationX = ((event.offsetX - width / 2) / width) * 35;
        const rotationY = ((event.offsetY - height / 2) / height) * 35;

        ticket.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      } else {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        element.style.setProperty('--x', `${x}px`);
        element.style.setProperty('--y', `${y}px`);
      }
    });

    const mouseLeave$ = fromEvent(element, 'mouseleave').subscribe(() => {
      if (ticket) {
        ticket.style.transform = 'rotateX(0deg) rotateY(0deg)';
      } else {
        element.style.setProperty('--x', `50%`);
        element.style.setProperty('--y', `50%`);
      }
    });

    this.subscriptions.push(mouseMove$, mouseLeave$);
  }

  // ==========================
  // Sección: Tarjetas Sociales
  // ==========================

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

  private toggleSocialCard(socialElement: HTMLElement) {
    if (socialElement.classList.contains('animation')) {
      socialElement.classList.add('down-animation');
      setTimeout(() => socialElement.classList.remove('down-animation'), 1000);
    }
    socialElement.classList.toggle('animation');
  }

  // ==========================
  // Sección: Animaciones Móviles
  // ==========================
  private startBouncingAnimation(card: HTMLDivElement) {
    let x = 50, y = 50;
    let dx = 1, dy = 1;

    const move = () => {
      const rect = card.getBoundingClientRect();

      if (x <= 0 || x >= rect.width) dx = -dx;
      if (y <= 0 || y >= rect.height) dy = -dy;

      x += dx;
      y += dy;

      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    };

    const intervalId = setInterval(move, 10);
    this.animationIntervals.push(intervalId);
  }

  private startMobileAnimations() {
    this.cardRefs.forEach((cardRef) => this.startBouncingAnimation(cardRef.nativeElement));

    this.wrapperRefs.forEach((wrapperRef, index) => {
      const ticketRef = this.ticketRefs.toArray()[index];
      const intervalId = setInterval(() => this.randomMove(ticketRef.nativeElement), 1000);
      this.animationIntervals.push(intervalId);
    });
  }

  private randomMove(ticket: HTMLDivElement) {
    const rotationX = (Math.random() - 0.5) * 60;
    const rotationY = (Math.random() - 0.5) * 60;
    ticket.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  }

  private stopMobileAnimations() {
    this.clearIntervals();
    this.resetPositions();
  }

  private resetPositions() {
    this.cardRefs.forEach(cardRef => {
      const card = cardRef.nativeElement;
      card.style.setProperty('--x', `50%`);
      card.style.setProperty('--y', `50%`);
    });

    this.ticketRefs.forEach(ticketRef => {
      ticketRef.nativeElement.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  private clearSubscriptions() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  private clearIntervals() {
    this.animationIntervals.forEach(intervalId => clearInterval(intervalId));
    this.animationIntervals = [];
  }

  private onMediaChange() {
    this.mobileMode = this.mobileQuery?.matches || false;
    if (this.mobileMode) {
      this.startMobileAnimations();
    } else {
      this.stopMobileAnimations();
    }
  }
}
