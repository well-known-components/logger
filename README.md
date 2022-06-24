# logger component

Simple stdout & stderr logger component. Prints JSON when `NODE_ENV=production`

## Config

### logLevel

Adjust the default level to be used for logging. It will log everything after the assigned level according to the following hierarchy:

"ALL" > "LOG" > "DEBUG" > "INFO" > "WARN" > "ERROR" > "OFF"

Eg:

```typescript
const config = { logLevel: "INFO" } // Set the log level
const loggerComponent = createLogComponent({ config })
const logger = getLogger("Test")

logger.info("log some info") // This will be logged
logger.warn("log some warn") // This will be logged
logger.debug("log some debug") // This will NOT be logged as `debug` has a lower level than `info`
```
