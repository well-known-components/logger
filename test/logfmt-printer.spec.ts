import type { ITracerComponent } from '@well-known-components/interfaces'
import { printLogfmt } from '../src/logfmt-printer'

let tracerComponentMock: ITracerComponent
let isInsideOfTraceSpanMock: jest.Mock
let getTraceStringMock: jest.Mock
const startsWithTrace = /^\[.+\].+/

const writeSpy = jest.spyOn(process.stderr, 'write')

describe('when printing a logfmt', () => {
  beforeEach(() => {
    isInsideOfTraceSpanMock = jest.fn()
    getTraceStringMock = jest.fn()
  })

  describe("and there's a tracer component available", () => {
    beforeEach(() => {
      tracerComponentMock = {
        isInsideOfTraceSpan: isInsideOfTraceSpanMock,
        getTraceString: getTraceStringMock
      } as unknown as ITracerComponent
    })

    describe.skip('and the logging is performed inside of a trace span', () => {
      beforeEach(() => {
        isInsideOfTraceSpanMock.mockReturnValue(true)
        getTraceStringMock.mockReturnValue('aTraceString')
        printLogfmt({ tracer: tracerComponentMock }, 'INFO', 'test', 'a test message')
      })

      it('should print the trace', () => {
        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('traceId=aTraceString'))
      })

      it('should print other information of the logger', () => {
        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO]'))
        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('(test)'))
        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('a test message'))
      })
    })

    describe('and the logging is not performed inside of a trace span', () => {
      beforeEach(() => {
        isInsideOfTraceSpanMock.mockReturnValue(false)
      })

      it('should not print anything related to the trace', () => {
        printLogfmt({ tracer: tracerComponentMock }, 'INFO', 'test', 'a test message')
        expect(writeSpy).toHaveBeenCalledWith(expect.not.stringMatching(startsWithTrace))
      })
    })
  })

  describe("and there's no tracer component available", () => {
    beforeEach(() => {
      tracerComponentMock = undefined
    })

    it('should not print anything related to the trace', () => {
      printLogfmt({ tracer: tracerComponentMock }, 'INFO', 'test', 'a test message')
      expect(writeSpy).toHaveBeenCalledWith(expect.not.stringMatching(startsWithTrace))
    })
  })
  describe('test extra', () => {
    beforeEach(() => {
      tracerComponentMock = undefined
    })

    it('should not print anything related to the trace', () => {
      printLogfmt({ tracer: tracerComponentMock }, 'INFO', 'test', 'a test message', { a: 1, b: { c: 3 } })
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('level=INFO logger=test msg="a test message" a=1 b={\"c\":3}')
      )
    })
  })
})
