import { sendMobileMessage, sendAnalyticsEvent, sendEvent } from './';

const undefinedImplementation = () => undefined;
const truthyEvaluationImplementation = () => true;
const foundCallbackImplementation = () => () => true;

const mockAnalyticsSystemObject = jest.fn();
const mockAnalyticsPageInteractionEventHandler = jest.fn();
const mockAnalyticsPageViewEventHandler = jest.fn();

const mockReactNativePostMessageHandler = jest.fn();
const mockiOSLegacyPostMessageHandler = jest.fn();
const mockAndroidLegacyPostMessageHandler = jest.fn();

const mockIsMobileWebViewHandler = jest.fn();

const bindMock = jest.fn(() => (eventPayload) => eventPayload);
const bindMockImplementation = () => ({
  bind: bindMock,
});

jest.mock('./helpers', () => ({
  getAnalyticsSystemObject: () => mockAnalyticsSystemObject(),
  getAnalyticsPageInteractionEventHandler: () => mockAnalyticsPageInteractionEventHandler(),
  getAnalyticsPageViewEventHandler: () => mockAnalyticsPageViewEventHandler(),
  getReactNativePostMessageHandler: () => mockReactNativePostMessageHandler(),
  getiOSLegacyPostMessageHandler: () => mockiOSLegacyPostMessageHandler(),
  getAndroidLegacyPostMessageHandler: () => mockAndroidLegacyPostMessageHandler(),
  isMobileWebView: () => mockIsMobileWebViewHandler(),
}));

describe('Abstraction Index functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('sendMobileMessage', () => {
    test('send react native post message', () => {
      // Arrange
      mockReactNativePostMessageHandler.mockImplementation(foundCallbackImplementation);
      mockiOSLegacyPostMessageHandler.mockImplementation(undefinedImplementation);
      mockAndroidLegacyPostMessageHandler.mockImplementation(foundCallbackImplementation);

      // Act
      sendMobileMessage('message');

      // Assert
      expect(mockReactNativePostMessageHandler).toHaveBeenCalledTimes(1);
      expect(mockiOSLegacyPostMessageHandler).toHaveBeenCalledTimes(0);
      expect(mockAndroidLegacyPostMessageHandler).toHaveBeenCalledTimes(0);
    });

    test('send ios legacy post message', () => {
      // Arrange
      mockReactNativePostMessageHandler.mockImplementation(undefinedImplementation);
      mockiOSLegacyPostMessageHandler.mockImplementation(foundCallbackImplementation);
      mockAndroidLegacyPostMessageHandler.mockImplementation(foundCallbackImplementation);

      // Act
      sendMobileMessage('message');

      // Assert
      expect(mockReactNativePostMessageHandler).toHaveBeenCalledTimes(1);
      expect(mockiOSLegacyPostMessageHandler).toHaveBeenCalledTimes(1);
      expect(mockAndroidLegacyPostMessageHandler).toHaveBeenCalledTimes(0);
    });

    test('send android legacy post message', () => {
      // Arrange
      mockReactNativePostMessageHandler.mockImplementation(undefinedImplementation);
      mockiOSLegacyPostMessageHandler.mockImplementation(undefinedImplementation);
      mockAndroidLegacyPostMessageHandler.mockImplementation(foundCallbackImplementation);

      // Act
      sendMobileMessage('message');

      // Assert
      expect(mockReactNativePostMessageHandler).toHaveBeenCalledTimes(1);
      expect(mockiOSLegacyPostMessageHandler).toHaveBeenCalledTimes(1);
      expect(mockAndroidLegacyPostMessageHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendAnalyticsEvent', () => {
    test('should throw error when no analytics system', () => {
      // Arrange
      mockAnalyticsSystemObject.mockImplementation(undefinedImplementation);

      // Act & Assert
      expect(() => sendAnalyticsEvent()).toThrowError(Error('Analytics system unavailable'));
    });

    test('should throw if no handler available for page view', () => {
      // Arrange
      mockAnalyticsSystemObject.mockImplementation(foundCallbackImplementation);
      mockAnalyticsPageViewEventHandler.mockImplementation(undefinedImplementation);
      const eventType = 'PAGE_VIEW';

      // Act & Assert
      expect(() => sendAnalyticsEvent(eventType)).toThrowError(
        Error('Analytics system event handler for PAGE_VIEW event is not available')
      );
    });

    test('should throw if no handler available for interaction', () => {
      // Arrange
      mockAnalyticsSystemObject.mockImplementation(foundCallbackImplementation);
      mockAnalyticsPageInteractionEventHandler.mockImplementation(undefinedImplementation);
      const eventType = 'INTERACTION';

      // Act & Assert
      expect(() => sendAnalyticsEvent(eventType)).toThrowError(
        Error('Analytics system event handler for INTERACTION event is not available')
      );
    });

    test('should call page view handler', () => {
      // Arrange
      mockAnalyticsSystemObject.mockImplementation(foundCallbackImplementation);
      mockAnalyticsPageViewEventHandler.mockImplementation(bindMockImplementation);

      // Act
      sendAnalyticsEvent('PAGE_VIEW');

      // Assert
      expect(bindMock).toHaveBeenCalledTimes(1);
    });

    test('should call interaction handler', () => {
      // Arrange
      mockAnalyticsSystemObject.mockImplementation(foundCallbackImplementation);
      mockAnalyticsPageInteractionEventHandler.mockImplementation(bindMockImplementation);

      // Act
      sendAnalyticsEvent('INTERACTION');

      // Assert
      expect(bindMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendEvent', () => {
    test('should call sendMobileMessage if is Mobile web view', () => {
      // Arrange
      mockIsMobileWebViewHandler.mockImplementation(truthyEvaluationImplementation);
      mockReactNativePostMessageHandler.mockImplementation(foundCallbackImplementation);
      mockAnalyticsSystemObject.mockImplementation(foundCallbackImplementation);
      mockAnalyticsPageInteractionEventHandler.mockImplementation(bindMockImplementation);

      // Act
      sendEvent('INTERACTION', { payload: '1' });

      // Assert
      expect(bindMock).toHaveBeenCalledTimes(0);
      expect(mockReactNativePostMessageHandler).toHaveBeenCalledTimes(1);
    });

    test('should call sendAnalyticsEvent if is not Mobile web view', () => {
      // Arrange
      mockIsMobileWebViewHandler.mockImplementation(undefinedImplementation);
      mockReactNativePostMessageHandler.mockImplementation(foundCallbackImplementation);
      mockAnalyticsSystemObject.mockImplementation(foundCallbackImplementation);
      mockAnalyticsPageInteractionEventHandler.mockImplementation(bindMockImplementation);

      // Act
      sendEvent('INTERACTION', { payload: '1' });

      // Assert
      expect(bindMock).toHaveBeenCalledTimes(1);
      expect(mockReactNativePostMessageHandler).toHaveBeenCalledTimes(0);
    });
  });
});
