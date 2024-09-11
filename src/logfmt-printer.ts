import { incrementMetric, LoggerComponents, LogLineFunction } from './helpers'

/**
 * https://brandur.org/logfmt
 * @internal
 */
export const printLogfmt: LogLineFunction = (
  components: LoggerComponents,
  kind: string,
  loggerName: string,
  message: string,
  extra: any
) => {
  incrementMetric(components, loggerName, kind)

  const structuredLog = {
    date: new Date().toISOString(),
    level: kind,
    logger: loggerName,
    msg: message,
    ...extra
  }

  return process.stderr.write(logfmt(structuredLog))
}

function logfmt(data: Record<string, any>) {
  var line = ''

  for (var key in data) {
    var value = data[key]
    var is_null = false
    if (value == null) {
      is_null = true
      value = ''
    } else if (typeof value == 'object') {
      value = JSON.stringify(value)
    } else {
      value = value.toString()

      var needs_quoting = value.indexOf(' ') > -1 || value.indexOf('=') > -1
      var needs_escaping = value.indexOf('"') > -1 || value.indexOf('\\') > -1

      if (needs_escaping) value = value.replace(/["\\]/g, '\\$&')
      if (needs_quoting || needs_escaping) value = '"' + value + '"'
      if (value === '' && !is_null) value = '""'
    }

    line += key + '=' + value + ' '
  }

  //trim traling space
  return line.substring(0, line.length - 1)
}
