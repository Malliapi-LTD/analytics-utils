import Queue from '.';
import { EventType } from '../eventTypes';

describe('Queue', () => {
  describe('processQueue', () => {});
  it('does not call the callback function when empty', () => {
    // Arrange
    const myQueue = new Queue();
    const callback = jest.fn();

    // Act
    myQueue.processQueue(callback);

    // Assert
    expect(callback).not.toHaveBeenCalled();
  });

  it('calls the callback function when it has events enqueued', () => {
    // Arrange
    const myQueue = new Queue();
    const callback = jest.fn();

    // Act
    myQueue.enqueueEvent(EventType.INTERACTION, {});
    myQueue.processQueue(callback);

    // Assert
    expect(callback).toHaveBeenCalled();
  });

  it('empties the queue once it has been processed', () => {
    // Arrange
    const myQueue = new Queue();
    const callback = jest.fn();

    // Act
    myQueue.enqueueEvent(EventType.INTERACTION, {});
    myQueue.processQueue(callback);
    myQueue.processQueue(callback);

    // Assert
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not empty the queue if the callback throws and retries on the next attempt', () => {
    // Arrange
    const myQueue = new Queue();
    const callback = jest.fn().mockImplementation(() => {
      throw new Error();
    });
    myQueue.enqueueEvent(EventType.INTERACTION, {});

    // Act & Assert
    expect(() => myQueue.processQueue(callback)).toThrowError(Error);
    expect(() => myQueue.processQueue(callback)).toThrowError(Error);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
