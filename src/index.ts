import { ILoggerComponent } from "@well-known-components/interfaces"
import { printCloudwatch } from "./cloudwatch-printer"
import { printConsole } from "./console-printer"
import { createGenericLogComponent } from "./helpers"

/**
 * Creates a scoped logger component that selects a readable output for tests
 * and json logger for NODE_ENV=production
 * @public
 */
export function createLogComponent(): ILoggerComponent {
  if (process.env.NODE_ENV == "production") {
    return createJsonLogComponent()
  } else {
    return createConsoleLogComponent()
  }
}

/**
 * Creates a scoped logger component to print a readable output to the stderr
 * @public
 */
export function createConsoleLogComponent(): ILoggerComponent {
  return createGenericLogComponent(printConsole)
}

/**
 * Creates a scoped logger component to print JSON to the stderr.
 * Useful for cloudwatch and other logging services.
 * @public
 */
export function createJsonLogComponent(): ILoggerComponent {
  return createGenericLogComponent(printCloudwatch)
}
