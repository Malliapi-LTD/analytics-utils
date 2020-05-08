import { trackInteractionEvent, trackPageView } from './';

const mockEnqueueEvent = jest.fn();
const mockProcessQueue = jest.fn();
jest.mock('./queue', () => {
  return jest.fn().mockImplementation(() => ({
    enqueueEvent: jest.fn(mockEnqueueEvent),
    processQueue: jest.fn(mockProcessQueue),
  }));
});

const mockSendEventHandler = jest.fn();
jest.mock('./abstraction', () => ({
  sendEvent: (...args) => mockSendEventHandler(...args),
  isAnalyticsSystemUnavailable: () => jest.fn(),
}));

describe('Tracking functions', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockReturnValue(undefined);
    jest.spyOn(window, 'addEventListener').mockReturnValue(undefined);
    jest.resetModules();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('onTagManagerReady', () => {
    it('event listener should be added', async () => {
      // Arrange
      await import('.');

      // Assert
      expect(window.addEventListener).toHaveBeenCalledWith('onTagManagerReady', expect.any(Function));
      expect(mockProcessQueue).not.toHaveBeenCalled();

      // Act
      const tagManagerCallback = (window.addEventListener as jest.MockedFunction<any>).mock.calls[0][1];
      tagManagerCallback();

      // Assert
      expect(mockProcessQueue).toHaveBeenCalledTimes(1);
    });
  });

  describe('trackInteractionEvent', () => {
    test('throw error when no args', () => {
      // Act & Assert
      expect(() => trackInteractionEvent(undefined as any)).toThrowError(Error('Error when tracking event: payload is missing'));
    });

    test('should call buildPayloadFn', () => {
      // Arrange
      const args = {
        eventCategory: 'TravelExtras_HotelUpsell',
        eventAction: 'Viewed',
        eventLabel: 'TravelExtras_HotelUpsell_ViewHotelShown_GBP_35.00',
        payload: {
          hToCode: 'id',
          hToName: 'name',
          hHotelDetails: 'name|id|rating',
          hotel_totalpriceinmarketcurrency: '35',
        },
      };
      const buildPayloadFn = jest.fn();

      // Act
      trackInteractionEvent(args as any, buildPayloadFn);

      // Assert
      expect(buildPayloadFn).toHaveBeenCalledTimes(1);
      expect(buildPayloadFn).toHaveBeenCalledWith(args);
    });

    test('throw error when if no basic payload', () => {
      // Act && Assert
      expect(() => trackInteractionEvent({} as any)).toThrowError(
        Error('event, eventName and eventLabel fields must be supplied to analytics events')
      );
    });

    test('should call sendEvent with type Interaction and payload', () => {
      // Arrange
      const args = {
        event: 'Event',
        eventName: 'EventName',
        eventCategory: 'TravelExtras_Continue',
        eventAction: 'Clicked',
        eventLabel: 'TravelExtras_Continue_Button',
        payload: {
          code: '1',
        },
      };

      // Act
      trackInteractionEvent(args);

      // Assert
      expect(mockSendEventHandler).toHaveBeenCalledTimes(1);
      expect(mockSendEventHandler).toHaveBeenCalledWith('INTERACTION', {
        event: 'Event',
        eventName: 'EventName',
        eventCategory: 'TravelExtras_Continue',
        eventAction: 'Clicked',
        eventLabel: 'TravelExtras_Continue_Button',
        payload: {
          code: '1',
        },
      });
    });

    test('should call enqueueEvent if there is an error', async () => {
      // Arrange
      const args = {
        eventCategory: 'TravelExtras_HotelUpsell',
        eventAction: 'Viewed',
        eventLabel: 'TravelExtras_HotelUpsell_ViewHotelShown_GBP_35.00',
        payload: {
          hToCode: 'id',
          hToName: 'name',
          hHotelDetails: 'name|id|rating',
          hotel_totalpriceinmarketcurrency: '35',
        },
      };
      const buildPayloadFn = jest.fn().mockReturnValue('some data');
      mockSendEventHandler.mockImplementationOnce(() => {
        throw new Error('tracking');
      });

      // eslint-disable-next-line no-shadow
      const { trackInteractionEvent } = await import('.');

      // Act
      trackInteractionEvent(args as any, buildPayloadFn);

      // Assert
      expect(mockEnqueueEvent).toHaveBeenCalledTimes(1);
      expect(mockEnqueueEvent).toHaveBeenCalledWith('INTERACTION', 'some data');
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledWith('Error when tracking event', Error('tracking'));
    });
  });

  describe('trackPageView', () => {
    test('throw error when no args', () => {
      // Assert
      expect(() => trackPageView(undefined as any)).toThrowError(Error('Error when tracking event: payload is missing'));
    });

    test('throw error when no page name', () => {
      // Assert
      expect(() => trackPageView({} as any)).toThrowError(
        Error('Error when tracking page view: pageName field is missing in payload')
      );
    });

    test('should call sendEvent with PAGE_VIEW and payload', () => {
      // Arrange
      const args = {
        pageName: 'TravelExtras',
        code: '1',
      };

      // Act
      trackPageView(args as any);

      // Assert
      expect(mockSendEventHandler).toHaveBeenCalledTimes(1);
      expect(mockSendEventHandler).toHaveBeenCalledWith('PAGE_VIEW', { code: '1', page_name: 'TravelExtras' });
    });
  });
});
