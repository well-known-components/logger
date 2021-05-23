import { LogLineFunction } from "./helpers"

/**
 * @internal
 */
export const printCloudwatch: LogLineFunction = (kind: string, loggerName: string, message: string, extra?: any) => {
  const logline = {
    timestamp: new Date().toISOString(),
    kind,
    system: loggerName,
    message,
    extra,
  }

  return process.stderr.write(JSON.stringify(logline) + "\n")
}
