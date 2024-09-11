# logger component

Simple stdout & stderr logger component.

## Config

### `LOG_LEVEL` configuration

Using the LOG_LEVEL value provided by the IConfigComponent, the following scale is used to filter out the log levels based on the following scale:

"ALL" > "LOG" > "DEBUG" > "INFO" > "WARN" > "ERROR" > "OFF"

Eg:

```typescript
const config: IConfigComponent = createConfigComponent({ ...process.env, LOG_LEVEL: 'INFO' })

const loggerComponent = createLogComponent({ config })
const logger = getLogger('Test')

logger.info('log some info') // This will be logged
logger.warn('log some warn') // This will be logged
logger.debug('log some debug') // This will NOT be logged
```

## Logger enhancers can be configured

```ts
// Datadog enhancer
const tracer = require('dd-trace')
const formats = require('dd-trace/ext/formats')

// enhances the "extra" field of each log to add new data. in this case
// dd.trace_id and dd.span_id will be added
function enhancer(extra) {
  var enhancedObject = extra || {}
  const time = new Date().toISOString()

  const span = tracer.scope().active()
  if (span) {
    tracer.inject(span.context(), formats.LOG, enhancedObject)
  }
  return enhancedObject
}

// in initComponents(), pass the enhancer
const logs = createJsonLogComponent({}, enhancer)
```

## The loggers generate metrics, use them like this:

```ts
// metrics.ts
import { validateMetricsDeclaration } from '@well-known-components/metrics'
import { metricDeclarations as logsMetricsDeclarations } from '@well-known-components/logger'

export const metricDeclarations = {
  // ...otherMetrics,
  ...logsMetricsDeclarations
}

// type assertions
validateMetricsDeclaration(metricDeclarations)
```

```ts
// in initComponents(), pass the metrics component to the component

const logs = createJsonLogComponent({ metrics })
```
