import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { HandAnimationService } from './Hand/hand-animation.service';
import { MobileAnimationsService } from './Mobile/mobile-animations.service';
import { SocialCardsService } from './Social/social-cards.service';
import { SocialCardHoverService } from './Social-card/social-card-hover.service';
import { TicketHoverService } from './tikets/ticket-hover.service';
import { UtilitiesAndCleanupService } from './Utilities/utilities-and-cleanup.service';

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

  constructor(
    private handAnimationService: HandAnimationService,
    private mobileAnimationsService: MobileAnimationsService,
    private socialCardsService: SocialCardsService,
    private socialCardHoverService: SocialCardHoverService,
    private ticketHoverService: TicketHoverService,
    private utilitiesService: UtilitiesAndCleanupService
  ) {
    if (typeof window !== 'undefined') {
      this.mobileQuery = window.matchMedia('(max-width: 768px)');
      this.mobileListener = () => this.onMediaChange();
      this.mobileQuery.addEventListener('change', this.mobileListener);
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.initializeServices();
      this.onMediaChange();
    }
  }

  ngOnDestroy() {
    if (this.mobileQuery && this.mobileListener) {
      this.mobileQuery.removeEventListener('change', this.mobileListener);
    }
    this.utilitiesService.clearIntervals();
    this.utilitiesService.clearSubscriptions(this.subscriptions);
  }

  private initializeServices() {
    this.ticketHoverService.initializeTicketHoverEffects(this.wrapperRefs, this.ticketRefs, this.subscriptions);
    this.socialCardHoverService.initializeSocialCardHoverEffects(this.cardRefs, this.subscriptions);
    this.socialCardsService.initializeSocialCards(this.subscriptions);
    this.handAnimationService.initializeHandAnimation(this.cardRefs, this.subscriptions);
  }

  private onMediaChange() {
    if (this.mobileQuery && this.mobileQuery.matches) {
      if (!this.mobileMode) {
        this.mobileMode = true;
        this.mobileAnimationsService.stopMobileAnimations();
        this.mobileAnimationsService.startMobileAnimations(this.cardRefs, this.wrapperRefs, this.ticketRefs);
      }
    } else {
      if (this.mobileMode) {
        this.mobileMode = false;
        this.mobileAnimationsService.stopMobileAnimations();
      }
    }
  }
}