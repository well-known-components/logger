import { ILoggerComponent } from '@well-known-components/interfaces'
import { printJson } from './json-printer'
import { printConsole } from './console-printer'
import { createGenericLogComponent, EnricherFunction, LoggerComponents } from './helpers'
import { metricDeclarations } from './metrics'
import { printLogfmt } from './logfmt-printer'

export { metricDeclarations }

/**
 * Creates a scoped logger component that selects a readable output for tests
 * and json logger for NODE_ENV=production
 * @public
 */
export async function createLogComponent(
  components: LoggerComponents,
  enricher?: EnricherFunction
): Promise<ILoggerComponent> {
  return createConsoleLogComponent(components, enricher)
}

/**
 * Creates a scoped logger component to print a readable output to the stderr
 *
 * @public
 */
export async function createConsoleLogComponent(
  components: LoggerComponents,
  enricher?: EnricherFunction
): Promise<ILoggerComponent> {
  return createGenericLogComponent(components, printConsole, enricher)
}

/**
 * Creates a scoped logger component to print JSON to the stderr.
 * Useful for cloudwatch and other logging services.
 * @public
 */
export async function createJsonLogComponent(
  components: LoggerComponents,
  enricher?: EnricherFunction
): Promise<ILoggerComponent> {
  return createGenericLogComponent(components, printJson, enricher)
}

/**
 * Creates a scoped logger component to print logfmt to the stderr.
 * Useful for cloudwatch and other logging services.
 * @public
 */
export async function createLogfmtLogComponent(
  components: LoggerComponents,
  enricher?: EnricherFunction
): Promise<ILoggerComponent> {
  return createGenericLogComponent(components, printLogfmt, enricher)
}
