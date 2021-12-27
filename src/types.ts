import { LovelaceCard, LovelaceCardConfig } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'hui-error-card': LovelaceCard;
  }
}

interface Person {
  name: string;
  track: string;
}

export interface Quote {
  content: string;
  author: string;
}

export interface MichaelsHeaderCardConfig extends LovelaceCardConfig {
  type: string;
  weather_entity: string;
  people: Array<Person>;
}
