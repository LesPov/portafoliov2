import { Injectable } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialCardsService {
  initializeSocialCards(subscriptions: Subscription[]) {
    ['card1-toggle1', 'card1-toggle2', 'card1-toggle3'].forEach((toggleId, index) => {
      const socialId = `card1-social${index + 1}`;
      const toggleElement = document.getElementById(toggleId);
      const socialElement = document.getElementById(socialId);

      if (toggleElement && socialElement) {
        subscriptions.push(fromEvent(toggleElement, 'click').subscribe(() => this.toggleSocialCard(socialElement)));
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
}