import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-resumen',
  standalone: true,
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('wrapper1, wrapper2, wrapper3, wrapper4, wrapper5, wrapper6,wrapper7,wrapper8') wrapperRefs!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('ticket1, ticket2, ticket3, ticket4, ticket5, ticket6,ticket7,ticket8') ticketRefs!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('card1') cardRefs!: QueryList<ElementRef<HTMLDivElement>>;

  private mobileQuery: MediaQueryList | undefined;
  private mobileListener: (() => void) | undefined;
  private mobileMode = false;
  private mobileSubscriptions: Subscription[] = [];
  private mobileIntervals: any[] = [];

  constructor(private renderer: Renderer2) {
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
        this.addHoverEffect(wrapperRef, ticketRef);
      });

      this.cardRefs.forEach((cardRef) => {
        this.addCardHoverEffect(cardRef);
      });

      this.initializeSocialCards();
      this.onMediaChange(); // Check initial media state
    }
  }

  ngOnDestroy() {
    if (this.mobileQuery && this.mobileListener) {
      this.mobileQuery.removeEventListener('change', this.mobileListener);
    }
    this.clearMobileIntervals();
    this.clearMobileSubscriptions();
  }

  private addHoverEffect(wrapperRef: ElementRef<HTMLDivElement>, ticketRef: ElementRef<HTMLDivElement>) {
    const wrapper = wrapperRef.nativeElement;
    const ticket = ticketRef.nativeElement;

    const mouseMove$ = fromEvent<MouseEvent>(wrapper, 'mousemove').subscribe(event => this.onMouseMove(event, wrapper, ticket));
    const mouseLeave$ = fromEvent(wrapper, 'mouseleave').subscribe(() => this.onMouseLeave(ticket));

    this.mobileSubscriptions.push(mouseMove$, mouseLeave$);
  }

  private addCardHoverEffect(cardRef: ElementRef<HTMLDivElement>) {
    const card = cardRef.nativeElement;

    const mouseMove$ = fromEvent<MouseEvent>(card, 'mousemove').subscribe(event => this.onCardMouseMove(event, card));
    const mouseLeave$ = fromEvent(card, 'mouseleave').subscribe(() => this.onCardMouseLeave(card));

    this.mobileSubscriptions.push(mouseMove$, mouseLeave$);
  }

  private onMouseMove(event: MouseEvent, wrapper: HTMLDivElement, ticket: HTMLDivElement) {
    if (this.mobileMode) return;

    const { width, height } = wrapper.getBoundingClientRect();
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const rotationX = ((event.offsetX - halfWidth) / halfWidth) * 30;
    const rotationY = ((event.offsetY - halfHeight) / halfHeight) * 30;

    ticket.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    ticket.style.transition = 'transform 0.3s';
  }

  private onMouseLeave(ticket: HTMLDivElement) {
    ticket.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }

  private onCardMouseMove(event: MouseEvent, card: HTMLDivElement) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Adjust for the center of the card
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  }

  private onCardMouseLeave(card: HTMLDivElement) {
    card.style.setProperty('--x', `50%`); // Center position when mouse leaves
    card.style.setProperty('--y', `50%`); // Center position when mouse leaves
  }

  private initializeSocialCards() {
    this.showSocial('card1-toggle1', 'card1-social1');
    this.showSocial('card1-toggle2', 'card1-social2');
    this.showSocial('card1-toggle3', 'card1-social3');
    // Add more initializations as needed
  }

  private showSocial(toggleCardId: string, socialCardId: string) {
    // Access the elements using Renderer2 for safe DOM manipulation
    const toggle = this.renderer.selectRootElement(`#${toggleCardId}`, true);
    const social = this.renderer.selectRootElement(`#${socialCardId}`, true);

    if (toggle && social) {
      this.renderer.listen(toggle, 'click', () => {
        if (social.classList.contains('animation')) {
          social.classList.add('down-animation');
          setTimeout(() => {
            social.classList.remove('down-animation');
          }, 1000);
        }
        social.classList.toggle('animation');
      });
    }
  }

  private onMediaChange() {
    if (this.mobileQuery) {
      this.mobileMode = this.mobileQuery.matches;
      if (this.mobileMode) {
        this.startMobileAnimations();
      } else {
        this.stopMobileAnimations();
      }
    }
  }

  private startMobileAnimations() {
    this.wrapperRefs.forEach((wrapperRef, index) => {
      const ticketRef = this.ticketRefs.toArray()[index];
      const intervalId = setInterval(() => {
        this.randomMove(wrapperRef, ticketRef);
      }, 1000);
      this.mobileIntervals.push(intervalId);
    });
  }

  private stopMobileAnimations() {
    this.clearMobileIntervals();
    this.resetPositions();
  }

  private clearMobileIntervals() {
    this.mobileIntervals.forEach(intervalId => clearInterval(intervalId));
    this.mobileIntervals = [];
  }

  private resetPositions() {
    this.ticketRefs.forEach((ticketRef) => {
      const ticket = ticketRef.nativeElement;
      ticket.style.transform = 'rotateX(0deg) rotateY(0deg)';
      ticket.style.transition = 'transform 0.3s';
    });
  }

  private randomMove(wrapperRef: ElementRef<HTMLDivElement>, ticketRef: ElementRef<HTMLDivElement>) {
    const ticket = ticketRef.nativeElement;
    const rotationX = (Math.random() - 0.5) * 60;
    const rotationY = (Math.random() - 0.5) * 60;
    ticket.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    ticket.style.transition = 'transform 0.3s';
  }

  private clearMobileSubscriptions() {
    this.mobileSubscriptions.forEach(sub => sub.unsubscribe());
    this.mobileSubscriptions = [];
  }
}
