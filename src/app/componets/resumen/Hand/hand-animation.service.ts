import { Injectable, ElementRef, QueryList } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HandAnimationService {
  initializeHandAnimation(cardRefs: QueryList<ElementRef<HTMLDivElement>>, subscriptions: Subscription[]) {
    cardRefs.forEach((cardRef, index) => {
      const handElement = document.getElementById(`hand${index + 1}`);
      const clickableSection = document.getElementById(`clickableSection${index + 1}`);
      const card1 = cardRef.nativeElement;

      if (handElement && clickableSection && card1) {
        const mouseEnter$ = fromEvent(clickableSection, 'mouseenter').subscribe(() => {
          handElement.classList.remove('hidden');
          handElement.style.animation = 'click-animation 1.5s infinite ease-in-out';
        });

        const mouseLeave$ = fromEvent(clickableSection, 'mouseleave').subscribe(() => {
          handElement.style.animation = 'none';
        });

        const click$ = fromEvent(clickableSection, 'click').subscribe(() => {
          handElement.classList.add('hidden');
        });

        const documentClick$ = fromEvent(document, 'click').subscribe((event: Event) => {
          if (!card1.contains(event.target as Node)) {
            handElement.classList.remove('hidden');
            setTimeout(() => {
              handElement.style.animation = '';
            }, 2);
          }
        });

        subscriptions.push(mouseEnter$, mouseLeave$, click$, documentClick$);
      }
    });
  }
}