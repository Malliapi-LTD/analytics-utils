import {
  getAnalyticsSystemObject,
  getAnalyticsPageInteractionEventHandler,
  getAnalyticsPageViewEventHandler,
  getReactNativePostMessageHandler,
  getiOSLegacyPostMessageHandler,
  getAndroidLegacyPostMessageHandler,
  isMobileWebView,
} from './helpers';

import { EventType } from '../eventTypes';
import { EventData } from '../eventData';

export { isAnalyticsSystemUnavailable } from './helpers';

/**
 * Sends a message to the mobile web view
 * @param  {string} message - The event payload to be sent
 */
export const sendMobileMessage = (message: string) => {
  const reactNativePostMessage = getReactNativePostMessageHandler();
  if (reactNativePostMessage) {
    reactNativePostMessage(message);
    return;
  }

  const iOSLegacyPostMessage = getiOSLegacyPostMessageHandler();
  if (iOSLegacyPostMessage) {
    iOSLegacyPostMessage(message);
    return;
  }

  const androidLegacyPostMessage = getAndroidLegacyPostMessageHandler();
  if (androidLegacyPostMessage) {
    androidLegacyPostMessage(message);
  }
};

/**
 * Sends an analytics event to the analytics system based on the
 * event type specified.
 * @param  {EventType} eventType - The type of event to be sent
 * @param  {EventData} eventPayload - The payload of the event
 */
export const sendAnalyticsEvent = (eventType: EventType, eventPayload: EventData) : void => {
  if (!getAnalyticsSystemObject()) {
    throw new Error('Analytics system unavailable');
  }

  const eventTypeHandlerMapper = {
    [EventType.PAGE_VIEW]: getAnalyticsPageViewEventHandler,
    [EventType.INTERACTION]: getAnalyticsPageInteractionEventHandler,
  };

  if (!eventTypeHandlerMapper[eventType]()) {
    throw new Error(`Analytics system event handler for ${eventType} event is not available`);
  }

  // Binding analytics system object as it uses the this object within it. Unless we bind it
  // the this object will now refer to the window object.
  // To correct this we bind the analytics system object to its internal functions.
  eventTypeHandlerMapper[eventType]()?.bind(getAnalyticsSystemObject())(eventPayload);
};

/**
 * Build a string to track datalayer on Mobile through postMessage.
 *
 * @param {object} data - Data to push into data layer
 * @returns {string} - The string to use in postMessage
 */
export const generateMobileDatalayerTracking = (data: EventData): string =>
  JSON.stringify({
    type: 'DATALAYER_TRACKING',
    data,
  });

/**
 * Send an event to the mobile web view if available, otherwise send it
 * to the analytics system.
 * @param  {EventType} eventType - The type of event to be sent
 * @param  {EventData} eventPayload - The payload of the event
 */
export const sendEvent = (eventType: EventType, eventPayload: EventData): void => {
  if (isMobileWebView()) {
    sendMobileMessage(generateMobileDatalayerTracking(eventPayload));
    return;
  }
  sendAnalyticsEvent(eventType, eventPayload);
};

export { EventType, EventData };