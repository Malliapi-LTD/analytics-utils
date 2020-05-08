import { EventData } from '../../eventData';

declare global {
  interface Window {
    utag?: {
      link?(eventData: EventData): void;
      view?(eventData: EventData): void;
    };
  }
}

export const getAnalyticsSystemObject = () => window?.utag;
export const getAnalyticsPageInteractionEventHandler = () => getAnalyticsSystemObject()?.link;
export const getAnalyticsPageViewEventHandler = () => getAnalyticsSystemObject()?.view;
