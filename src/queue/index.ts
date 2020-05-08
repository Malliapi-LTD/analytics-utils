import { EventData } from '../eventData';
import { EventType } from '../eventTypes';

interface QueuedEvent {
  eventType: EventType;
  eventPayload: EventData;
}

class Queue {
  queueStore: QueuedEvent[];

  constructor() {
    this.queueStore = [];
  }

  enqueueEvent(eventType: EventType, eventPayload: EventData) {
    this.queueStore.push({ eventType, eventPayload });
  }

  processQueue(sendEventHandler: (eventType: EventType, eventPayload: EventData) => void) {
    if (!this.queueStore.length) {
      return;
    }
    this.queueStore.forEach(queueItem => {
      sendEventHandler(queueItem.eventType, queueItem.eventPayload);
    });
    this.queueStore = [];
  }
}

export default Queue;
