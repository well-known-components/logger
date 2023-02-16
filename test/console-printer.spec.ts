import type { ITracerComponent } from "@well-known-components/interfaces"
import { printConsole } from "../src/console-printer"

let tracerComponentMock: ITracerComponent
let isInsideOfTraceSpanMock: jest.Mock
let getTraceStringMock: jest.Mock
const startsWithTrace = /^\[.+\].+/

const writeSpy = jest.spyOn(process.stderr, "write")

describe("when printing a console log", () => {
  beforeEach(() => {
    isInsideOfTraceSpanMock = jest.fn()
    getTraceStringMock = jest.fn()
  })

  describe("and there's a tracer component available", () => {
    beforeEach(() => {
      tracerComponentMock = {
        isInsideOfTraceSpan: isInsideOfTraceSpanMock,
        getTraceString: getTraceStringMock,
      } as unknown as ITracerComponent
    })

    describe("and the logging is performed inside of a trace span", () => {
      beforeEach(() => {
        isInsideOfTraceSpanMock.mockReturnValue(true)
        getTraceStringMock.mockReturnValue("aTraceString")
        printConsole({ tracer: tracerComponentMock }, "INFO", "test", "a test message")
      })

      it("should print the trace", () => {
        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining("[aTraceString]"))
      })

      it("should print other information of the logger", () => {
        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining("[INFO]"))
        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining("(test)"))
        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining("a test message"))
      })
    })

    describe("and the logging is not performed inside of a trace span", () => {
      beforeEach(() => {
        isInsideOfTraceSpanMock.mockReturnValue(false)
      })

      it("should not print anything related to the trace", () => {
        printConsole({ tracer: tracerComponentMock }, "INFO", "test", "a test message")
        expect(writeSpy).toHaveBeenCalledWith(expect.not.stringMatching(startsWithTrace))
      })
    })
  })

  describe("and there's no tracer component available", () => {
    beforeEach(() => {
      tracerComponentMock = undefined
    })

    it("should not print anything related to the trace", () => {
      printConsole({ tracer: tracerComponentMock }, "INFO", "test", "a test message")
      expect(writeSpy).toHaveBeenCalledWith(expect.not.stringMatching(startsWithTrace))
    })
  })
})
