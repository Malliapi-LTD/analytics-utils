import {
  getReactNativePostMessageHandler,
  getiOSLegacyPostMessageHandler,
  getAndroidLegacyPostMessageHandler,
} from './mobile';

describe('React-Native Mobile View', () => {
  beforeEach(() => {
    global.ReactNativeWebView = {
      postMessage: jest.fn(),
    };
  });
  test('retrieves window.ReactNativeWebView.postMessage when calling getReactNativePostMessageHandler', () => {
    // Act
    const reactNativePostMessageHandler = getReactNativePostMessageHandler();

    // Assert
    expect(reactNativePostMessageHandler).toEqual(global.ReactNativeWebView.postMessage);
  });
  test('calls window.ReactNativeWebView.postMessage when calling getReactNativePostMessageHandler()', () => {
    // Act
    const reactNativePostMessageHandler = getReactNativePostMessageHandler();
    reactNativePostMessageHandler({});

    // Assert
    expect(global.ReactNativeWebView.postMessage).toHaveBeenCalled();
  });
});

describe('React-Native Legacy iOS Mobile View', () => {
  beforeEach(() => {
    global.webkit = {
      messageHandlers: {
        reactNative: {
          postMessage: jest.fn(),
        },
      },
    };
  });
  test('retrieves window.webkit.messageHandlers.reactNative.postMessage when calling getiOSLegacyPostMessageHandler', () => {
    // Act
    const iOSLegacyPostMessageHandler = getiOSLegacyPostMessageHandler();

    // Assert
    expect(iOSLegacyPostMessageHandler).toEqual(global.webkit.messageHandlers.reactNative.postMessage);
  });
  test('calls window.webkit.messageHandlers.reactNative.postMessage when calling getiOSLegacyPostMessageHandler()', () => {
    // Act
    const iOSLegacyPostMessageHandler = getiOSLegacyPostMessageHandler();
    iOSLegacyPostMessageHandler({});

    // Assert
    expect(global.webkit.messageHandlers.reactNative.postMessage).toHaveBeenCalledTimes(1);
  });
});

describe('React-Native Legacy Android Mobile View', () => {
  beforeEach(() => {
    global.WebViewBridge = {
      send: jest.fn(),
    };
  });
  test('retrieves window.WebViewBridge.send when calling getAndroidLegacyPostMessageHandler', () => {
    // Act
    const androidLegacyPostMessageHandler = getAndroidLegacyPostMessageHandler();

    // Assert
    expect(androidLegacyPostMessageHandler).toEqual(global.WebViewBridge.send);
  });
  test('calls window.WebViewBridge.send when calling getAndroidLegacyPostMessageHandler()', () => {
    // Act
    const androidLegacyPostMessageHandler = getAndroidLegacyPostMessageHandler();
    androidLegacyPostMessageHandler({});

    // Assert
    expect(global.WebViewBridge.send).toHaveBeenCalledTimes(1);
  });
});
