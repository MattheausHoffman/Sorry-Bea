import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type FloatingHeart = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
};

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private heartId = 0;

  readonly messages = [
    'Eu errei, mas meu carinho por você continua gigante.',
    'Prometo te ouvir melhor e cuidar do seu coração com mais atenção.',
    'Seu sorriso é meu lugar favorito no mundo.',
    'Você é muito especial pra mim, Beatriz.',
  ] as const;

  readonly currentMessageIndex = signal(0);
  readonly apologyAccepted = signal(false);
  readonly envelopeOpened = signal(false);
  readonly envelopeOpening = signal(false);
  readonly hearts = signal<FloatingHeart[]>([]);

  readonly currentMessage = computed(() => this.messages[this.currentMessageIndex()]);

  nextMessage(): void {
    this.currentMessageIndex.update(
      (index) => (index + 1) % this.messages.length,
    );
    this.launchHearts(5);
  }

  openLetter(): void {
    if (this.envelopeOpening() || this.envelopeOpened()) {
      return;
    }

    this.envelopeOpening.set(true);

    setTimeout(() => {
      this.envelopeOpened.set(true);
      this.envelopeOpening.set(false);
      this.launchHearts(10);
    }, 900);
  }

  launchHearts(total = 12): void {
    const freshHearts = Array.from({ length: total }, () => this.createHeart());
    const idsToRemove = new Set(freshHearts.map((heart) => heart.id));

    this.hearts.update((current) => [...current, ...freshHearts]);

    setTimeout(() => {
      this.hearts.update((current) =>
        current.filter((heart) => !idsToRemove.has(heart.id)),
      );
    }, 4200);
  }

  forgiveMe(): void {
    this.apologyAccepted.set(true);
    this.launchHearts(20);
  }

  private createHeart(): FloatingHeart {
    this.heartId += 1;

    return {
      id: this.heartId,
      left: 8 + Math.random() * 84,
      size: 18 + Math.round(Math.random() * 26),
      duration: 2600 + Math.round(Math.random() * 1800),
      delay: Math.round(Math.random() * 500),
    };
  }
}
