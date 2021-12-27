import { localize } from "../localize/localize";
import { HomeAssistant } from 'custom-card-helpers';

function getGreeting(): string {
  const today = new Date()
  const curHr = today.getHours()

  if (curHr < 12) {
    return localize('greetings.morning');
  } else if (curHr < 18) {
    return localize('greetings.afternoon');
  } else {
    return localize('greetings.evening');
  }
}

export default function getMessage(hass: HomeAssistant) {
  return getGreeting() + ", " + hass.user.name.split(" ")[0];
}