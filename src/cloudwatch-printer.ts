import { incrementMetric, LoggerComponents, LogLineFunction } from "./helpers"

/**
 * @internal
 */
export const printCloudwatch: LogLineFunction = (
  components: LoggerComponents,
  kind: string,
  loggerName: string,
  message: string,
  extra?: any
) => {
  const logline = {
    timestamp: new Date().toISOString(),
    kind,
    system: loggerName,
    message,
    extra,
  }

  incrementMetric(components, loggerName, kind)

  return process.stderr.write(JSON.stringify(logline) + "\n")
}
