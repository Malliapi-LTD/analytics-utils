export interface EventData {
    event?: string;
    eventName?: string;
    eventCategory?: string;
    eventAction?: string;
    eventLabel?: string;
    pageName?: string;
    [key: string]: string | string[] | object | undefined;
  }
  