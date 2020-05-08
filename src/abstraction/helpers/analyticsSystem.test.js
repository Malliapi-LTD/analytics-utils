import {
  getAnalyticsSystemObject,
  getAnalyticsPageInteractionEventHandler,
  getAnalyticsPageViewEventHandler,
} from './analyticsSystem';

describe('Tealium', () => {
  describe('is available', () => {
    beforeEach(() => {
      global.utag = {
        link: jest.fn(),
        view: jest.fn(),
      };
    });

    afterEach(() => {
      delete global.utag;
    });

    test('retrieves window.utag when calling getAnalyticsSystemObject', () => {
      // Act
      const analyticsSystemObject = getAnalyticsSystemObject();

      // Assert
      expect(analyticsSystemObject).toEqual(global.utag);
    });
    test('retrieves window.utag.link when calling getAnalyticsPageInteractionEventHandler', () => {
      // Act
      const analyticsInteractionEventHandler = getAnalyticsPageInteractionEventHandler();

      // Assert
      expect(analyticsInteractionEventHandler).toEqual(global.utag.link);
    });
    test('calls window.utag.link when calling getAnalyticsPageInteractionEventHandler()', () => {
      // Act
      const analyticsInteractionEventHandler = getAnalyticsPageInteractionEventHandler();
      analyticsInteractionEventHandler();

      // Assert
      expect(global.utag.link).toHaveBeenCalled();
    });
    test('retrieves window.utag.view when calling getAnalyticsPageViewEventHandler', () => {
      // Act
      const analyticsPageViewEventHandler = getAnalyticsPageViewEventHandler();

      // Assert
      expect(analyticsPageViewEventHandler).toEqual(global.utag.view);
    });
    test('calls window.utag.view when calling getAnalyticsPageViewEventHandler()', () => {
      // Act
      const analyticsPageViewEventHandler = getAnalyticsPageViewEventHandler();
      analyticsPageViewEventHandler();

      // Assert
      expect(global.utag.view).toHaveBeenCalled();
    });
  });

  describe('is not available', () => {
    beforeEach(() => {
      global.utag = undefined;
    });
    test('does not retrieve window.utag when calling getAnalyticsSystemObject', () => {
      // Act
      const analyticsSystemObject = getAnalyticsSystemObject();

      // Assert
      expect(analyticsSystemObject).toBeFalsy();
    });

    test('does not retrieve window.utag.link when calling getAnalyticsPageInteractionEventHandler', () => {
      // Act
      const analyticsInteractionEventHandler = getAnalyticsPageInteractionEventHandler();

      // Assert
      expect(analyticsInteractionEventHandler).toBeFalsy();
    });

    test('does not retrieve window.utag.view when calling getAnalyticsPageViewEventHandler', () => {
      // Act
      const analyticsPageViewEventHandler = getAnalyticsPageViewEventHandler();

      // Assert
      expect(analyticsPageViewEventHandler).toBeFalsy();
    });
  });
});
