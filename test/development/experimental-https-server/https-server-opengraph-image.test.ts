import { nextTestSetup } from 'e2e-utils'
import https from 'https'
import { renderViaHTTP, shouldRunTurboDevTest } from 'next-test-utils'

describe('experimental-https-server OpenGraph image', () => {
  const { next, skipped } = nextTestSetup({
    files: __dirname,
    startCommand: `pnpm next ${
      shouldRunTurboDevTest() ? 'dev --turbo' : 'dev'
    } --experimental-https`,
    skipStart: !process.env.NEXT_TEST_CI,
  })
  if (skipped) return

  if (!process.env.NEXT_TEST_CI) {
    console.warn('only runs on CI as it requires administrator privileges')
    it('only runs on CI as it requires administrator privileges', () => {})
    return
  }

  const agent = new https.Agent({
    rejectUnauthorized: false,
  })

  it('should generate https:// URLs for OpenGraph images when experimental HTTPS is enabled', async () => {
    expect(next.url).toContain('https://')
    const html = await renderViaHTTP(next.url, '/1', undefined, { agent })
    expect(html).toContain('Hello from App')
    expect(html).toMatch(/<meta property="og:image" content="https:\/\//)
    expect(html).toMatch(/<meta property="twitter:image" content="https:\/\//)
  })
})
