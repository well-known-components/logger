import { createGenericLogComponent } from "../src/helpers"

describe("Helpers", () => {
  describe("Log Level", () => {
    it("should log all messages when no config log level is provided", () => {
      const print = jest.fn()
      const loggerComponent = createGenericLogComponent({}, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      logger.debug("debug")
      logger.info("info")
      logger.warn("warn")
      logger.error("error")
      expect(print).toHaveBeenCalledTimes(5)
    })

    it("should log all messages when the log level is ALL", () => {
      const config = { logLevel: "ALL" }
      const print = jest.fn()
      const loggerComponent = createGenericLogComponent({ config }, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      logger.debug("debug")
      logger.info("info")
      logger.warn("warn")
      logger.error("error")
      expect(print).toHaveBeenCalledTimes(5)
    })

    it("should log all messages with a log level greater than LOG", () => {
      const config = { logLevel: "LOG" }
      const print = jest.fn()
      const loggerComponent = createGenericLogComponent({ config }, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      logger.debug("debug")
      logger.info("info")
      logger.warn("warn")
      logger.error("error")
      expect(print).toHaveBeenCalledTimes(5)
    })

    it("should log all messages with a log level greater than DEBUG", () => {
      const config = { logLevel: "DEBUG" }
      const print = jest.fn()
      const loggerComponent = createGenericLogComponent({ config }, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      expect(print).toHaveBeenCalledTimes(0)

      logger.debug("debug")
      logger.info("info")
      logger.warn("warn")
      logger.error("error")
      expect(print).toHaveBeenCalledTimes(4)
    })

    it("should log all messages with a log level greater than INFO", () => {
      const config = { logLevel: "INFO" }
      const print = jest.fn()
      const loggerComponent = createGenericLogComponent({ config }, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      logger.debug("debug")
      expect(print).toHaveBeenCalledTimes(0)

      logger.info("info")
      logger.warn("warn")
      logger.error("error")
      expect(print).toHaveBeenCalledTimes(3)
    })

    it("should log all messages with a log level greater than WARN", () => {
      const config = { logLevel: "WARN" }
      const print = jest.fn()
      const loggerComponent = createGenericLogComponent({ config }, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      logger.debug("debug")
      logger.info("info")
      expect(print).toHaveBeenCalledTimes(0)

      logger.warn("warn")
      logger.error("error")
      expect(print).toHaveBeenCalledTimes(2)
    })

    it("should log all messages with a log level greater than ERROR", () => {
      const config = { logLevel: "ERROR" }
      const print = jest.fn()
      const loggerComponent = createGenericLogComponent({ config }, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      logger.debug("debug")
      logger.info("info")
      logger.warn("warn")
      expect(print).toHaveBeenCalledTimes(0)

      logger.error("error")
      expect(print).toHaveBeenCalledTimes(1)
    })

    it("should not log any message when the log level is OFF", () => {
      const config = { logLevel: "OFF" }
      const print = jest.fn()
      const loggerComponent = createGenericLogComponent({ config }, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      logger.debug("debug")
      logger.info("info")
      logger.warn("warn")
      logger.error("error")
      expect(print).toHaveBeenCalledTimes(0)
    })
  })
})
