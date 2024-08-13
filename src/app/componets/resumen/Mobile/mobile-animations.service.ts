import { Injectable, ElementRef, QueryList } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileAnimationsService {
  private animationIntervals: any[] = [];

  startMobileAnimations(cardRefs: QueryList<ElementRef<HTMLDivElement>>, wrapperRefs: QueryList<ElementRef<HTMLDivElement>>, ticketRefs: QueryList<ElementRef<HTMLDivElement>>) {
    cardRefs.forEach((cardRef) => this.startBouncingAnimation(cardRef.nativeElement));

    wrapperRefs.forEach((wrapperRef, index) => {
      const ticketRef = ticketRefs.toArray()[index];
      const intervalId = setInterval(() => this.randomMove(ticketRef.nativeElement), 1000);
      this.animationIntervals.push(intervalId);
    });
  }

  stopMobileAnimations() {
    this.clearIntervals();
    this.resetPositions();
  }

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

  private randomMove(ticket: HTMLDivElement) {
    const rotationX = (Math.random() - 0.5) * 60;
    const rotationY = (Math.random() - 0.5) * 60;
    ticket.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  }

  private clearIntervals() {
    this.animationIntervals.forEach(intervalId => clearInterval(intervalId));
    this.animationIntervals = [];
  }

  private resetPositions() {
    // This method should be implemented to reset positions of animated elements
  }
}