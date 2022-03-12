import { IMetricsComponent } from "@well-known-components/interfaces"

// @internal
function validateMetricsDeclaration<T extends string>(
  metricsDefinition: IMetricsComponent.MetricsRecordDefinition<T>
): IMetricsComponent.MetricsRecordDefinition<T> {
  return metricsDefinition
}

/**
 * Metrics declarations, needed for your IMetricsComponent
 * @public
 */
 export const metricDeclarations = validateMetricsDeclaration({
  wkc_logger_logs_total: {
    help: "Log amounts per logger and level",
    type: IMetricsComponent.CounterType,
    labelNames: ["logger", "level"],
  }
})
