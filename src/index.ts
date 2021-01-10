import { ILoggerComponent } from "@well-known-components/interfaces"

const print = (kind: string, loggerName: string, message: string, extra: any) => {
  // logs should go to the stderr to be properly forwarded in some environments
  const extraLine = extra ? "\t" + JSON.stringify(extra) : ""
  return process.stderr.write(
    new Date().toISOString() + " [" + kind + "] (" + loggerName + "): " + message + extraLine + "\n"
  )
}

/**
 * Creates a scoped logger component.
 * @public
 */
export function createLogComponent(): ILoggerComponent {
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
          print("ERROR", loggerName, error.toString(), extra || error)
          console.error(error)
        },
      }
    },
  }
}
