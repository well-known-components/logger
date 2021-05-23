import { ILoggerComponent } from "@well-known-components/interfaces"

/**
 * @public
 */
export type LogLineFunction = (kind: string, loggerName: string, message: string, extra?: any) => void

/**
 * Creates a scoped logger component using a LogLineFunction function.
 * @public
 */
 export function createGenericLogComponent(print: LogLineFunction): ILoggerComponent {
  return {
    getLogger(loggerName: string) {
      return {
        log(message: string, extra?: Record<string, string | number>) {
          print("LOG", loggerName, message, extra)
        },
        warn(message: string, extra?: Record<string, string | number>) {
          print("WARNING", loggerName, message, extra)
        },
        info(message: string, extra?: Record<string, string | number>) {
          print("INFO", loggerName, message, extra)
        },
        debug(message: string, extra?: Record<string, string | number>) {
          print("DEBUG", loggerName, message, extra)
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

          print("ERROR", loggerName, message, extra || error)
          if (printTrace) {
            console.trace()
          }
        },
      }
    },
  }
}
