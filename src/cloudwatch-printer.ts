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
  const trace = components.tracer?.isInsideOfTraceSpan() ? components.tracer.getTrace() : undefined

  const logline = {
    timestamp: new Date().toISOString(),
    kind,
    system: loggerName,
    message,
    extra,
    traceId: trace?.traceId,
    parentId: trace?.parentId,
  }

  incrementMetric(components, loggerName, kind)

  return process.stderr.write(JSON.stringify(logline) + "\n")
}
