import { ILoggerComponent } from "@well-known-components/interfaces"
import { printCloudwatch } from "./cloudwatch-printer"
import { printConsole } from "./console-printer"
import { createGenericLogComponent, LoggerComponents } from "./helpers"
import { metricDeclarations } from "./metrics"

export { metricDeclarations }

/**
 * Creates a scoped logger component that selects a readable output for tests
 * and json logger for NODE_ENV=production
 * @public
 */
export async function createLogComponent(components: LoggerComponents): Promise<ILoggerComponent> {
  return createConsoleLogComponent(components)
}

/**
 * Creates a scoped logger component to print a readable output to the stderr
 * @public
 */
export async function createConsoleLogComponent(components: LoggerComponents): Promise<ILoggerComponent> {
  return createGenericLogComponent(components, printConsole)
}

/**
 * Creates a scoped logger component to print JSON to the stderr.
 * Useful for cloudwatch and other logging services.
 * @public
 */
export async function createJsonLogComponent(components: LoggerComponents): Promise<ILoggerComponent> {
  return createGenericLogComponent(components, printCloudwatch)
}
