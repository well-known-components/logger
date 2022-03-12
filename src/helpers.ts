import { ILoggerComponent, IMetricsComponent } from "@well-known-components/interfaces"
import { metricDeclarations } from "./metrics"

/**
 * @public
 */
export type LoggerComponents = {
  metrics?: IMetricsComponent<keyof typeof metricDeclarations>
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
 * Creates a scoped logger component using a LogLineFunction function.
 * @public
 */
export function createGenericLogComponent(components: LoggerComponents, print: LogLineFunction): ILoggerComponent {
  return {
    getLogger(loggerName: string) {
      return {
        log(message: string, extra?: Record<string, string | number>) {
          print(components, "LOG", loggerName, message, extra)
        },
        warn(message: string, extra?: Record<string, string | number>) {
          print(components, "WARNING", loggerName, message, extra)
        },
        info(message: string, extra?: Record<string, string | number>) {
          print(components, "INFO", loggerName, message, extra)
        },
        debug(message: string, extra?: Record<string, string | number>) {
          print(components, "DEBUG", loggerName, message, extra)
        },
        error(error: string | Error, extra?: Record<string, string | number>) {
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
