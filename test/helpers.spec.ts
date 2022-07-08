import { createGenericLogComponent } from "../src/helpers"
import { createConfigComponent } from "@well-known-components/env-config-provider"

describe("Helpers",  () => {
  describe("Log Level",  () => {
    it("should log all messages when no config log level is provided", async () => {
      const print = jest.fn()
      const loggerComponent = await createGenericLogComponent({}, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      logger.debug("debug")
      logger.info("info")
      logger.warn("warn")
      logger.error("error")
      expect(print).toHaveBeenCalledTimes(5)
    })

    it("should log all messages when the log level is ALL", async () => {
      const config = createConfigComponent({ LOG_LEVEL: "ALL" })
      const print = jest.fn()
      const loggerComponent = await createGenericLogComponent({ config }, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      logger.debug("debug")
      logger.info("info")
      logger.warn("warn")
      logger.error("error")
      expect(print).toHaveBeenCalledTimes(5)
    })

    it("should log all messages with a log level greater than LOG", async () => {
      const config = createConfigComponent({ LOG_LEVEL: "LOG" })
      const print = jest.fn()
      const loggerComponent = await createGenericLogComponent({ config }, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      logger.debug("debug")
      logger.info("info")
      logger.warn("warn")
      logger.error("error")
      expect(print).toHaveBeenCalledTimes(5)
    })

    it("should log all messages with a log level greater than DEBUG", async () => {
      const config = createConfigComponent({ LOG_LEVEL: "DEBUG" })
      const print = jest.fn()
      const loggerComponent = await createGenericLogComponent({ config }, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      expect(print).toHaveBeenCalledTimes(0)

      logger.debug("debug")
      logger.info("info")
      logger.warn("warn")
      logger.error("error")
      expect(print).toHaveBeenCalledTimes(4)
    })

    it("should log all messages with a log level greater than INFO", async () => {
      const config = createConfigComponent({ LOG_LEVEL: "INFO" })
      const print = jest.fn()
      const loggerComponent = await createGenericLogComponent({ config }, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      logger.debug("debug")
      expect(print).toHaveBeenCalledTimes(0)

      logger.info("info")
      logger.warn("warn")
      logger.error("error")
      expect(print).toHaveBeenCalledTimes(3)
    })

    it("should log all messages with a log level greater than WARN", async () => {
      const config = createConfigComponent({ LOG_LEVEL: "WARN" })
      const print = jest.fn()
      const loggerComponent = await createGenericLogComponent({ config }, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      logger.debug("debug")
      logger.info("info")
      expect(print).toHaveBeenCalledTimes(0)

      logger.warn("warn")
      logger.error("error")
      expect(print).toHaveBeenCalledTimes(2)
    })

    it("should log all messages with a log level greater than ERROR", async () => {
      const config = createConfigComponent({ LOG_LEVEL: "ERROR" })
      const print = jest.fn()
      const loggerComponent = await createGenericLogComponent({ config }, print)
      const logger = loggerComponent.getLogger("test")

      logger.log("log")
      logger.debug("debug")
      logger.info("info")
      logger.warn("warn")
      expect(print).toHaveBeenCalledTimes(0)

      logger.error("error")
      expect(print).toHaveBeenCalledTimes(1)
    })

    it("should not log any message when the log level is OFF", async () => {
      const config = createConfigComponent({ LOG_LEVEL: "OFF" })
      const print = jest.fn()
      const loggerComponent = await createGenericLogComponent({ config }, print)
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
