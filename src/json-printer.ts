import { incrementMetric, LoggerComponents, LogLineFunction } from './helpers'

/**
 * @internal
 */
export const printJson: LogLineFunction = (
  components: LoggerComponents,
  kind: string,
  loggerName: string,
  message: string,
  extra?: any
) => {
  const trace = components.tracer?.isInsideOfTraceSpan() ? components.tracer.getTrace() : undefined

  const logline = {
    timestamp: new Date().toISOString(),
    level: kind,
    logger: loggerName,
    message,
    traceId: trace?.traceId || undefined,
    parentId: trace?.parentId || undefined,
    ...extra
  }

  incrementMetric(components, loggerName, kind)

  return process.stderr.write(JSON.stringify(logline) + '\n')
}
