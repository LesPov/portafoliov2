import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesAndCleanupService {
  private animationIntervals: any[] = [];

  clearIntervals() {
    this.animationIntervals.forEach(intervalId => clearInterval(intervalId));
    this.animationIntervals = [];
  }

  clearSubscriptions(subscriptions: Subscription[]) {
    subscriptions.forEach(subscription => subscription.unsubscribe());
    subscriptions.length = 0;
  }

  resetPositions(cardRefs: HTMLDivElement[], ticketRefs: HTMLDivElement[]) {
    cardRefs.forEach(card => {
      card.style.setProperty('--x', `50%`);
      card.style.setProperty('--y', `50%`);
    });

    ticketRefs.forEach(ticket => {
      ticket.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  addAnimationInterval(intervalId: any) {
    this.animationIntervals.push(intervalId);
  }
}