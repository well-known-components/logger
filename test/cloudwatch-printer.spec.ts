import type { ITracerComponent } from "@well-known-components/tracer-component"
import { printCloudwatch } from "../src/cloudwatch-printer"

let tracerComponentMock: ITracerComponent
let isInsideOfTraceSpanMock: jest.Mock
let getTraceMock: jest.Mock

const writeSpy = jest.spyOn(process.stderr, "write")

describe("when printing a cloudwatch log", () => {
  beforeEach(() => {
    isInsideOfTraceSpanMock = jest.fn()
    getTraceMock = jest.fn()
  })

  describe("and there's a tracer component available", () => {
    beforeEach(() => {
      tracerComponentMock = {
        isInsideOfTraceSpan: isInsideOfTraceSpanMock,
        getTrace: getTraceMock,
      } as unknown as ITracerComponent
    })

    describe("and the logging is performed inside of a trace span", () => {
      beforeEach(() => {
        isInsideOfTraceSpanMock.mockReturnValue(true)
        getTraceMock.mockReturnValue({
          traceId: "aTraceString",
          parentId: "aParentId",
        })
      })

      it("should print the trace", () => {
        printCloudwatch({ tracer: tracerComponentMock }, "INFO", "test", "a test message")
        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('"traceId":"aTraceString"'))
        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('"parentId":"aParentId"'))
      })
    })

    describe("and the logging is not performed inside of a trace span", () => {
      beforeEach(() => {
        isInsideOfTraceSpanMock.mockReturnValue(false)
      })

      it("should not print anything related to the trace", () => {
        printCloudwatch({ tracer: tracerComponentMock }, "INFO", "test", "a test message")
        expect(writeSpy).toHaveBeenCalledWith(expect.not.stringContaining('"traceId":"aTraceString"'))
        expect(writeSpy).toHaveBeenCalledWith(expect.not.stringContaining('"parentId":"aParentId"'))
      })
    })
  })

  describe("and there's no tracer component available", () => {
    beforeEach(() => {
      tracerComponentMock = undefined
    })

    it("should not print anything related to the trace", () => {
      printCloudwatch({ tracer: tracerComponentMock }, "INFO", "test", "a test message")
      expect(writeSpy).toHaveBeenCalledWith(expect.not.stringContaining('"traceId":"aTraceString"'))
      expect(writeSpy).toHaveBeenCalledWith(expect.not.stringContaining('"parentId":"aParentId"'))
    })
  })
})
