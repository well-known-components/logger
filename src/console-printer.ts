import { LogLineFunction } from "./helpers"

/**
 * @internal
 */
export const printConsole: LogLineFunction = (kind: string, loggerName: string, message: string, extra: any) => {
  // logs should go to the stderr to be properly forwarded in some environments
  const extraLine = extra ? "\t" + JSON.stringify(extra) : ""
  return process.stderr.write(
    new Date().toISOString() + " [" + kind + "] (" + loggerName + "): " + message + extraLine + "\n"
  )
}
