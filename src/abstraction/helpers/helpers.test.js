import { isMobileWebView, isAnalyticsSystemUnavailable } from './helpers';

const undefinedImplementation = () => undefined;
const foundCallbackImplementation = () => () => true;

const mockAnalyticsSystemObject = jest.fn();
const mockAnalyticsPageInteractionEventHandler = jest.fn();
const mockAnalyticsPageViewEventHandler = jest.fn();

jest.mock('./analyticsSystem', () => ({
  getAnalyticsSystemObject: () => mockAnalyticsSystemObject(),
  getAnalyticsPageInteractionEventHandler: () => mockAnalyticsPageInteractionEventHandler(),
  getAnalyticsPageViewEventHandler: () => mockAnalyticsPageViewEventHandler(),
}));

const mockReactNativePostMessageHandler = jest.fn();
const mockiOSLegacyPostMessageHandler = jest.fn();
const mockAndroidLegacyPostMessageHandler = jest.fn();

jest.mock('./mobile', () => ({
  getReactNativePostMessageHandler: () => mockReactNativePostMessageHandler(),
  getiOSLegacyPostMessageHandler: () => mockiOSLegacyPostMessageHandler(),
  getAndroidLegacyPostMessageHandler: () => mockAndroidLegacyPostMessageHandler(),
}));

describe('isAnalyticsSystemUnavailable', () => {
  describe('is falsy', () => {
    test('getAnalyticsSystemObject is truthy and all handlers are truthy', () => {
      // Arrange
      mockAnalyticsSystemObject.mockImplementation(foundCallbackImplementation);
      mockAnalyticsPageInteractionEventHandler.mockImplementation(foundCallbackImplementation);
      mockAnalyticsPageViewEventHandler.mockImplementation(foundCallbackImplementation);

      // Act
      expect(isAnalyticsSystemUnavailable()).toBeFalsy();

      // Assert
      expect(mockAnalyticsSystemObject).toHaveBeenCalled();
      expect(mockAnalyticsPageInteractionEventHandler).toHaveBeenCalled();
      expect(mockAnalyticsPageViewEventHandler).toHaveBeenCalled();
    });
  });

  describe('is truthy', () => {
    test('getAnalyticsSystemObject is falsy', () => {
      // Arrange
      mockAnalyticsSystemObject.mockImplementation(undefinedImplementation);

      // Act
      const analyticsSystemUnavailable = isAnalyticsSystemUnavailable();

      // Assert
      expect(analyticsSystemUnavailable).toBeTruthy();
      expect(mockAnalyticsSystemObject).toHaveBeenCalled();
      expect(mockAnalyticsPageInteractionEventHandler).not.toHaveBeenCalled();
      expect(mockAnalyticsPageViewEventHandler).not.toHaveBeenCalled();
    });

    test('getAnalyticsSystemObject is truthy and getAnalyticsPageInteractionEventHandler is falsy', () => {
      // Arrange
      mockAnalyticsSystemObject.mockImplementation(foundCallbackImplementation);
      mockAnalyticsPageInteractionEventHandler.mockImplementation(undefinedImplementation);

      // Act
      const analyticsSystemUnavailable = isAnalyticsSystemUnavailable();

      // Assert
      expect(analyticsSystemUnavailable).toBeTruthy();
      expect(mockAnalyticsSystemObject).toHaveBeenCalled();
      expect(mockAnalyticsPageInteractionEventHandler).toHaveBeenCalled();
      expect(mockAnalyticsPageViewEventHandler).not.toHaveBeenCalled();
    });

    test('getAnalyticsSystemObject is truthy, getAnalyticsPageInteractionEventHandler is truthy and getAnalyticsPageViewEventHandler is falsy', () => {
      // Arrange
      mockAnalyticsSystemObject.mockImplementation(foundCallbackImplementation);
      mockAnalyticsPageInteractionEventHandler.mockImplementation(foundCallbackImplementation);
      mockAnalyticsPageViewEventHandler.mockImplementation(undefinedImplementation);

      // Act
      const analyticsSystemUnavailable = isAnalyticsSystemUnavailable();

      // Assert
      expect(analyticsSystemUnavailable).toBeTruthy();
      expect(mockAnalyticsSystemObject).toHaveBeenCalled();
      expect(mockAnalyticsPageInteractionEventHandler).toHaveBeenCalled();
      expect(mockAnalyticsPageViewEventHandler).toHaveBeenCalled();
    });
  });
});

describe('isMobileWebView', () => {
  describe('is falsy', () => {
    test('no handlers are truthy', () => {
      // Arrange
      mockReactNativePostMessageHandler.mockImplementation(undefinedImplementation);
      mockiOSLegacyPostMessageHandler.mockImplementation(undefinedImplementation);
      mockAndroidLegacyPostMessageHandler.mockImplementation(undefinedImplementation);

      // Act
      const movileWebViewAvailable = isMobileWebView();

      // Assert
      expect(movileWebViewAvailable).toBeFalsy();
      expect(mockReactNativePostMessageHandler).toHaveBeenCalled();
      expect(mockiOSLegacyPostMessageHandler).toHaveBeenCalled();
      expect(mockAndroidLegacyPostMessageHandler).toHaveBeenCalled();
    });
  });

  describe('is truthy', () => {
    test('getReactNativePostMessageHandler handler is a function only', () => {
      // Arrange
      mockReactNativePostMessageHandler.mockImplementation(foundCallbackImplementation);
      mockiOSLegacyPostMessageHandler.mockImplementation(undefinedImplementation);
      mockAndroidLegacyPostMessageHandler.mockImplementation(undefinedImplementation);

      // Act
      const movileWebViewAvailable = isMobileWebView();

      // Assert
      expect(movileWebViewAvailable).toBeTruthy();
      expect(mockReactNativePostMessageHandler).toHaveBeenCalled();
      expect(mockiOSLegacyPostMessageHandler).not.toHaveBeenCalled();
      expect(mockAndroidLegacyPostMessageHandler).not.toHaveBeenCalled();
    });

    it('getiOSLegacyPostMessageHandler handler is a function only', () => {
      // Arrange
      mockReactNativePostMessageHandler.mockImplementation(undefinedImplementation);
      mockiOSLegacyPostMessageHandler.mockImplementation(foundCallbackImplementation);
      mockAndroidLegacyPostMessageHandler.mockImplementation(undefinedImplementation);

      // Act
      const movileWebViewAvailable = isMobileWebView();

      // Assert
      expect(movileWebViewAvailable).toBeTruthy();
      expect(mockReactNativePostMessageHandler).toHaveBeenCalled();
      expect(mockiOSLegacyPostMessageHandler).toHaveBeenCalled();
      expect(mockAndroidLegacyPostMessageHandler).not.toHaveBeenCalled();
    });

    it('getAndroidLegacyPostMessageHandler handler is a function only', () => {
      // Arrange
      mockReactNativePostMessageHandler.mockImplementation(undefinedImplementation);
      mockiOSLegacyPostMessageHandler.mockImplementation(undefinedImplementation);
      mockAndroidLegacyPostMessageHandler.mockImplementation(foundCallbackImplementation);

      // Act
      const movileWebViewAvailable = isMobileWebView();

      // Assert
      expect(movileWebViewAvailable).toBeTruthy();
      expect(mockReactNativePostMessageHandler).toHaveBeenCalled();
      expect(mockiOSLegacyPostMessageHandler).toHaveBeenCalled();
      expect(mockAndroidLegacyPostMessageHandler).toHaveBeenCalled();
    });
  });
});
