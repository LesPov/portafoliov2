import { Injectable, ElementRef, QueryList } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialCardHoverService {
  initializeSocialCardHoverEffects(cardRefs: QueryList<ElementRef<HTMLDivElement>>, subscriptions: Subscription[]) {
    cardRefs.forEach(cardRef => {
      this.addSocialCardHoverEffect(cardRef.nativeElement, subscriptions);
    });
  }

  private addSocialCardHoverEffect(card: HTMLDivElement, subscriptions: Subscription[]) {
    const mouseMove$ = fromEvent<MouseEvent>(card, 'mousemove').subscribe(event => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });

    const mouseLeave$ = fromEvent(card, 'mouseleave').subscribe(() => {
      card.style.setProperty('--x', '50%');
      card.style.setProperty('--y', '50%');
    });

    subscriptions.push(mouseMove$, mouseLeave$);
  }
}