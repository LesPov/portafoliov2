import { Injectable, ElementRef, QueryList } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketHoverService {
  initializeTicketHoverEffects(wrapperRefs: QueryList<ElementRef<HTMLDivElement>>, ticketRefs: QueryList<ElementRef<HTMLDivElement>>, subscriptions: Subscription[]) {
    wrapperRefs.forEach((wrapperRef, index) => {
      const ticketRef = ticketRefs.toArray()[index];
      this.addTicketHoverEffect(wrapperRef.nativeElement, ticketRef.nativeElement, subscriptions);
    });
  }

  private addTicketHoverEffect(wrapper: HTMLDivElement, ticket: HTMLDivElement, subscriptions: Subscription[]) {
    const mouseMove$ = fromEvent<MouseEvent>(wrapper, 'mousemove').subscribe(event => {
      const { width, height } = wrapper.getBoundingClientRect();
      const rotationX = ((event.offsetX - width / 2) / width) * 35;
      const rotationY = ((event.offsetY - height / 2) / height) * 35;

      ticket.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    });

    const mouseLeave$ = fromEvent(wrapper, 'mouseleave').subscribe(() => {
      ticket.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });

    subscriptions.push(mouseMove$, mouseLeave$);
  }
}