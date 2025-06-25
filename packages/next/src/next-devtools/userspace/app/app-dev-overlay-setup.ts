import { patchConsoleError } from './errors/intercept-console-error'
import { handleGlobalErrors } from './errors/use-error-handler'
import { patchLogs } from './term-logs/client'
console.log('patching')

handleGlobalErrors()
patchConsoleError()
patchLogs('app')
