import { ILoggerComponent, IMetricsComponent, IConfigComponent } from "@well-known-components/interfaces"
import { ITracerComponent } from "@well-known-components/tracer-component"
import { metricDeclarations } from "./metrics"

/**
 * @public
 */
export type LoggerComponents = {
  metrics?: IMetricsComponent<keyof typeof metricDeclarations>
  config?: IConfigComponent
  tracer?: ITracerComponent
}

/**
 * @public
 */
export type LogLineFunction = (
  components: LoggerComponents,
  kind: string,
  loggerName: string,
  message: string,
  extra?: any
) => void

/**
 * @public
 */
export type ILoggerConfigComponent = {
  logLevel: string
}

/**
 * @public
 */
export type LogLevel = "ALL" | "LOG" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "OFF"

/**
 * Creates a scoped logger component using a LogLineFunction function.
 * @public
 */
export async function createGenericLogComponent(
  components: LoggerComponents,
  print: LogLineFunction
): Promise<ILoggerComponent> {
  const levelsEnum = { ALL: 0, LOG: 1, DEBUG: 2, INFO: 4, WARN: 8, ERROR: 16, OFF: 1 | 2 | 4 | 8 | 16 }

  let minLogLevel: LogLevel = "ALL"
  let numericMinLevel = levelsEnum[minLogLevel] || 0

  function setLogLevel(level: LogLevel) {
    if (level && level in levelsEnum) {
      minLogLevel = level
      numericMinLevel = levelsEnum[minLogLevel] || 0
    }
  }

  // set ALL log level by default
  setLogLevel("ALL")

  if (components.config) {
    try {
      // if a config component is provided, we try to get the LOG_LEVEL config
      const newLevel = await components.config.getString("LOG_LEVEL")
      if (newLevel) setLogLevel(newLevel as LogLevel)
    } catch (error: any) {
      print(components, "ERROR", "LOG_LEVEL", error.toString(), error)
    }
  }

  // Print every log greater than or equal to a certain level
  const shouldPrint = (logLevel: LogLevel) => {
    const numericLevel = levelsEnum[logLevel]
    return numericLevel >= numericMinLevel
  }

  return {
    getLogger(loggerName: string) {
      return {
        log(message: string, extra?: Record<string, string | number>) {
          if (shouldPrint("LOG")) {
            print(components, "LOG", loggerName, message, extra)
          }
        },
        warn(message: string, extra?: Record<string, string | number>) {
          if (shouldPrint("WARN")) {
            print(components, "WARNING", loggerName, message, extra)
          }
        },
        info(message: string, extra?: Record<string, string | number>) {
          if (shouldPrint("INFO")) {
            print(components, "INFO", loggerName, message, extra)
          }
        },
        debug(message: string, extra?: Record<string, string | number>) {
          if (shouldPrint("DEBUG")) {
            print(components, "DEBUG", loggerName, message, extra)
          }
        },
        error(error: string | Error, extra?: Record<string, string | number>) {
          if (shouldPrint("ERROR")) {
            let message = `${error}`
            let printTrace = true

            if (error instanceof Error && "stack" in error && typeof error.stack == "string") {
              if (error.stack!.includes(error.message)) {
                message = error.stack
                printTrace = false
              }
            }

            print(components, "ERROR", loggerName, message, extra || error)
            if (printTrace) {
              console.trace()
            }
          }
        },
      }
    },
  }
}

// @internal
export function incrementMetric(components: LoggerComponents, loggerName: string, level: string) {
  if (components.metrics) {
    components.metrics.increment("wkc_logger_logs_total", { logger: loggerName, level })
  }
}
