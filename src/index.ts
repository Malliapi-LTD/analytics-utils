import Queue from './queue';
import { sendEvent, isAnalyticsSystemUnavailable } from './abstraction';
import { EventData } from './eventData';
import { EventType } from './eventTypes';

const analyticsQueueInstance = new Queue();

const attachAnalyticsSystemReadyHandlerIfNeeded = (): void => {
  if (typeof window !== 'undefined' && isAnalyticsSystemUnavailable()) {
    window.addEventListener('onTagManagerReady', () => analyticsQueueInstance.processQueue(sendEvent));
  }
};

attachAnalyticsSystemReadyHandlerIfNeeded();

/**
 * Uses sendEvent to send the event to analytics or queues the event
 * if an error occurs
 * @param  {EventType} eventType - Type of event being sent. One of PAGE_VIEW or INTERACTION
 * @param  {EventData} eventPayload - Key-Value pairs which will be sent via sendEvend method
 */
const trackEventOrQueue = (eventType: EventType, eventPayload: EventData): void => {
  try {
    // Release any events pushed to queue
    // before analytics had loaded
    analyticsQueueInstance.processQueue(sendEvent);
    sendEvent(eventType, eventPayload);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Error when tracking event', e);
    analyticsQueueInstance.enqueueEvent(eventType, eventPayload);
  }
};

/**
 * Hydrates & formats the analytics data payload to the agreed-upon format.
 *
 * @param {Object} args - key-value pairs which will be logged to the analytics engine
 * @param {string} [args.event] - type of event being sent
 * @param {string} [args.eventName] - name of the event the event
 * @param {string} [args.eventLabel] - an optional value that will be prefixed by "T:" in any payload sent
 *
 * @returns {Object} - An object containing all the fields in a format suitable for interpretation by the dataLayer
 */
const buildInteractionEventPayload = (args: EventData): EventData => {
  const { event, eventName, eventLabel, ...rest } = args;

  const hasBasicPayload = event && eventName && eventLabel;

  if (!hasBasicPayload) {
    throw new Error('event, eventName and eventLabel fields must be supplied to analytics events');
  }

  const payload = {
    ...rest,
    eventLabel,
    eventName,
    event,
  };

  return payload;
};

/**
 * Pushes an enhanced version of the supplied object to sendEvent.
 *
 * @param {Object} args - Key-Value pairs which will be logged to the analytics engine
 * @param {function} [buildPayloadFn=buildInteractionEventPayload] - function to manipulate the args before sending tracking event
 */
const trackInteractionEvent = (args: EventData, buildPayloadFn: (args: EventData) => EventData = buildInteractionEventPayload):void => {
  if (!args) {
    throw new Error('Error when tracking event: payload is missing');
  }

  const interactionEventPayload = buildPayloadFn(args);

  trackEventOrQueue(EventType.INTERACTION, interactionEventPayload);
};

/**
 * Pushes an enhanced version of the supplied object to sendEvent.
 *
 * @param {Object} args - Key-Value pairs which will be logged to the analytics engine
 */
const trackPageView = (args: EventData):void => {
  if (!args) {
    throw new Error('Error when tracking event: payload is missing');
  }

  const { pageName, ...eventPayload } = args;
  if (!pageName) {
    throw new Error('Error when tracking page view: pageName field is missing in payload');
  }

  const payload = {
    ...eventPayload,
    page_name: pageName,
  };

  trackEventOrQueue(EventType.PAGE_VIEW, payload);
};

export { trackPageView, trackInteractionEvent, isAnalyticsSystemUnavailable };
