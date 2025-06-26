// Used to deterministically stub out minified local names in stack traces.
const abc = 'abcdefghijklmnopqrstuvwxyz'

export function getPrerenderOutput(
  cliOutput: string,
  { isMinified }: { isMinified: boolean }
): string {
  const lines: string[] = []
  let foundPrerenderingLine = false
  let i = 0

  const replaceNextDistStackFrame = () =>
    `at ${abc[i++ % abc.length]} (<next-dist-dir>)`

  const replaceAnonymousStackFrame = () =>
    `at ${abc[i++ % abc.length]} (<anonymous>)`

  for (const line of cliOutput.split('\n')) {
    if (line.includes('Collecting page data')) {
      foundPrerenderingLine = true
      continue
    }

    if (line.includes('Next.js build worker exited')) {
      break
    }

    if (foundPrerenderingLine && !line.includes('Generating static pages')) {
      lines.push(
        isMinified
          ? line
              .replace(/at [\w.]+ \(.next[^)]+\)/, replaceNextDistStackFrame)
              .replace(/at [\w.]+ \(<anonymous>\)/, replaceAnonymousStackFrame)
          : line.replace(
              /at ([\w.]+) \((webpack:\/\/)\/src[^)]+\)/,
              `at $1 ($2<next-src>)`
            )
      )
    }
  }

  return lines.join('\n').trim()
}
