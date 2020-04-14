import amplitude from 'amplitude-js';

// Initialize Amplitude for tracking
export function initAmplitude() {
  amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE_API_KEY);
}

// Log an event
export function amplitudeEvent(title) {
  amplitude.getInstance().logEvent(title);
}

// Set user properties
// param: userProperties: { key: value, key: value }
export function amplitudeIdentify(userProperties) {
  amplitude.getInstance().setUserProperties(userProperties);
}
