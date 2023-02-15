import { incrementMetric, LoggerComponents, LogLineFunction } from "./helpers"

/**
 * @internal
 */
export const printConsole: LogLineFunction = (
  components: LoggerComponents,
  kind: string,
  loggerName: string,
  message: string,
  extra: any
) => {
  incrementMetric(components, loggerName, kind)

  // logs should go to the stderr to be properly forwarded in some environments
  const extraLine = extra ? "\t" + JSON.stringify(extra) : ""
  const trace = components.tracer?.isInsideOfTraceSpan() ? components.tracer?.getTraceString() : undefined
  return process.stderr.write(
    trace
      ? `[${trace}] `
      : "" + new Date().toISOString() + " [" + kind + "] (" + loggerName + "): " + message + extraLine + "\n"
  )
}
