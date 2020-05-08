import {
  getAnalyticsSystemObject,
  getAnalyticsPageInteractionEventHandler,
  getAnalyticsPageViewEventHandler,
} from './analyticsSystem';

import {
  getReactNativePostMessageHandler,
  getiOSLegacyPostMessageHandler,
  getAndroidLegacyPostMessageHandler,
} from './mobile';

export const isMobileWebView = () : boolean =>
  getReactNativePostMessageHandler() || getiOSLegacyPostMessageHandler() || getAndroidLegacyPostMessageHandler();

export const isAnalyticsSystemUnavailable = () : boolean =>
  !getAnalyticsSystemObject() || !getAnalyticsPageInteractionEventHandler() || !getAnalyticsPageViewEventHandler();
