declare global {
  interface Window {
    ReactNativeWebView?: any;
    WebViewBridge?: any;
    webkit?: any;
  }
}

export const getReactNativePostMessageHandler = () => window?.ReactNativeWebView?.postMessage;
export const getiOSLegacyPostMessageHandler = () => window?.webkit?.messageHandlers?.reactNative?.postMessage;
export const getAndroidLegacyPostMessageHandler = () => window?.WebViewBridge?.send;
