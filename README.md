# Analytics Utility Library
This is a shared analytics package written in Javascript for use across frontend applications which require integration with analytics tag managers such as GTM or Tealium.


## Prerequisites

* [Node.js][node] latest LTS (see package.json entries for "engine"), for development environments it is recommended to use a version manager such as [nvm][nvm]
* [Yarn][yarn] for managing dependencies

 [node]: https://nodejs.org/en/
 [yarn]: https://yarnpkg.com/
 [nvm]: https://github.com/creationix/nvm


## Installing
To install repo:

- Make sure **prerequisites** from above are installed.


- Install dependencies with yarn

```bash
# install
yarn install
```

## Build

```bash
# run
yarn build
```

## Tests
You can run test using these commands:
```bash
# linter scss and js
yarn lint 

# tests
yarn test

# tests with coverage
yarn test:ci
```

## Using the Analytics Utility Library
```bash
  npm install @malliapi/analytics-utils
```
or 
```bash
  yarn add @malliapi/analytics-utils
```

## API Reference
```javascript
  const analyticsUtils = require('@malliapi/analytics-utils');
```

### trackInteractionEvent()
```javascript
  analyticsUtils.trackInteractionEvent()
```
Pushes an enhanced version of the supplied object to sendEvent.

**@param** {Object} args - Key-Value pairs which will be logged to the analytics engine

**@param** {function} [buildPayloadFn=buildInteractionEventPayload] - function to manipulate the args before sending tracking event

----

### trackPageView()
```javascript
  analyticsUtils.trackPageView()
```
Pushes an enhanced version of the supplied object to sendEvent.

**@param** {Object} args - Key-Value pairs which will be logged to the analytics engine
