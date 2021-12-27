/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LitElement,
  html,
  TemplateResult,
  css,
  PropertyValues,
  CSSResultGroup,
} from 'lit';
import { customElement, property, state } from "lit/decorators";
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  createThing
} from 'custom-card-helpers';

import type { MichaelsHeaderCardConfig, Quote } from './types';
import { version } from '../package.json';
import { localize } from './localize/localize';
import getMessage from './helpers/getMessage';
import getQuote from './helpers/getQuote';

/* eslint no-console: 0 */
console.info(
  `%c  MICHAELS-HEADER-CARD  \n%c     ${localize('common.version')} ${version}      `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

@customElement('michaels-header-card')
export class MichaelsHeaderCard extends LitElement {

  // TODO Add any properities that should cause your element to re-render here
  // https://lit.dev/docs/components/properties/
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private quote!: Quote;

  @state() private config!: MichaelsHeaderCardConfig;

  constructor() {
    super();
    this.fetchQuote();
  }

  // https://lit.dev/docs/components/properties/#accessors-custom
  public setConfig(config: MichaelsHeaderCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    this.config = {
      name: 'Michael\'s Header Card',
      ...config,
    };
  }

  // https://lit.dev/docs/components/lifecycle/#reactive-update-cycle-performing
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    return hasConfigOrEntityChanged(this, changedProps, false) || changedProps.has('quote');
  }

  protected renderWeatherCard(): any {
    const weatherCard = createThing({
      "type": "custom:simple-weather-card",
      "entity": this.config.weather_entity,
      "backdrop": true
    });

    weatherCard.hass = this.hass;

    return weatherCard;
  }

  protected renderPerson(): any {

    const trackerArray: Array<string> = [];

    this.config.people.forEach(person => {
      trackerArray.push(person.track)
    });

    const personCard = createThing({
      "type": "entities",
      "entities": trackerArray
    });

    personCard.hass = this.hass;

    return personCard;
  }

  protected async fetchQuote(): Promise<void> {
    console.log("Fetching quote...")
    const quote = await getQuote();
    this.quote = quote;
  }

  // https://lit.dev/docs/components/rendering/
  protected render(): TemplateResult | void {
    // TODO Check for stateObj or other necessary things and render a warning if missing
    if (this.config.show_warning) {
      return this._showWarning(localize('common.show_warning') + JSON.stringify(this.config.people));
    }

    // Error if config is invalid
    if (!(this.config.weather_entity && this.config.people)) {
      return this._showError(localize('common.invalid_configuration'));
    }

    return html`
      <ha-card>
        <div class="container">
          <div class="title">
            <h1 class="title-message">
              ${ getMessage(this.hass) }
            </h1>
            ${ this.quote
              ? html`
              <h2 class="subtitle-message">
                <p>
                  ${ this.quote.content }
                </p>
                <p class="right">— ${ this.quote.author }</p>
              </h2>
              `
              : html`
              <p>Loading...</p>
              `
            }
            
          </div>

          <div class="weather">
            ${ this.renderWeatherCard() }
          </div>

          <div class="people">
            ${ this.renderPerson() }
          </div>
        </div>
      </ha-card>
    `;
  }

  private _showWarning(warning: string): TemplateResult {
    return html`
      <hui-warning>${warning}</hui-warning>
    `;
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this.config,
    });

    return html`
      ${errorCard}
    `;
  }

  // https://lit.dev/docs/components/styles/
  static get styles(): CSSResultGroup {
    return css`
      ha-card {
        border-radius: 0;
        padding: 10px;
        margin-bottom: 2em;
      }

      .container {
        max-width: 1500px;
        margin: 0 auto;
        overflow: auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        grid-gap: 1rem;
      }

      .title {
        padding: 0 16px;
      }

      .title .title-message {
        font-size: 2.5em;
        line-height: 1em;
      }

      .title .subtitle-message {
        font-size: 1.5em;
        line-height: 1.5em;
        font-weight: normal;
        opacity: 0.8;
      }

      .subtitle-message p {
        margin: 0;
      }

      .subtitle-message p.right {
        float: right;
      }

      .weather {
        margin-top: 16px;
      }
    `;
  }
}
