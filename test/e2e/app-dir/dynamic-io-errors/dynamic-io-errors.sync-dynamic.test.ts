import { nextTestSetup } from 'e2e-utils'
import { getPrerenderOutput } from './utils'

describe.each([
  { inDebugMode: true, name: 'With --prerender-debug' },
  { inDebugMode: false, name: 'Without --prerender-debug' },
])('Dynamic IO Errors - $name', ({ inDebugMode }) => {
  describe('Sync Dynamic - With Fallback - client searchParams', () => {
    const { next, isNextDev, skipped } = nextTestSetup({
      files: __dirname + '/fixtures/sync-client-search-with-fallback',
      skipStart: true,
      skipDeployment: true,
      buildOptions: inDebugMode ? ['--debug-prerender'] : undefined,
    })

    if (skipped) {
      return
    }

    if (isNextDev) {
      it('does not run in dev', () => {})
      return
    }

    it('should not error the build when synchronously reading search params in a client component if all dynamic access is inside a Suspense boundary', async () => {
      try {
        await next.start()
      } catch {
        throw new Error('expected build not to fail for fully static project')
      }

      expect(next.cliOutput).toContain('◐ / ')
      const $ = await next.render$('/')
      expect($('[data-fallback]').length).toBe(2)
    })
  })

  describe('Sync Dynamic - Without Fallback - client searchParams', () => {
    const { next, isNextDev, isTurbopack, skipped } = nextTestSetup({
      files: __dirname + '/fixtures/sync-client-search-without-fallback',
      skipStart: true,
      skipDeployment: true,
      buildOptions: inDebugMode ? ['--debug-prerender'] : undefined,
    })

    if (skipped) {
      return
    }

    if (isNextDev) {
      it('does not run in dev', () => {})
      return
    }

    it('should error the build if dynamic IO happens in the root (outside a Suspense)', async () => {
      try {
        await next.start()
      } catch {
        // we expect the build to fail
      }

      const output = getPrerenderOutput(next.cliOutput, {
        isMinified: !inDebugMode,
      })

      if (isTurbopack) {
        if (inDebugMode) {
          expect(output).toMatchInlineSnapshot(`
           "Error: Route "/": A component accessed data, headers, params, searchParams, or a short-lived cache without a Suspense boundary nor a "use cache" above it. We don't have the exact line number added to error messages yet but you can see which component in the stack below. See more info: https://nextjs.org/docs/messages/next-prerender-missing-suspense
               at LongRunningComponent (<anonymous>)
               at IndirectionTwo (turbopack:///[project]/app/indirection.tsx:7:33)
               at Page (turbopack:///[project]/app/page.tsx:19:60)
               at RenderFromTemplateContext (<anonymous>)
               at main (<anonymous>)
               at body (<anonymous>)
               at html (<anonymous>)
              5 | }
              6 |
           >  7 | export function IndirectionTwo({ children }) {
                |                                 ^
              8 |   return children
              9 | }
             10 |
           Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error

           > Export encountered errors on following paths:
           	/page: /"
          `)
        } else {
          expect(output).toMatchInlineSnapshot(`
           "Error: Route "/": A component accessed data, headers, params, searchParams, or a short-lived cache without a Suspense boundary nor a "use cache" above it. We don't have the exact line number added to error messages yet but you can see which component in the stack below. See more info: https://nextjs.org/docs/messages/next-prerender-missing-suspense
               at a (<anonymous>)
               at b (<next-dist-dir>)
               at c (<next-dist-dir>)
               at d (<next-dist-dir>)
               at e (<next-dist-dir>)
               at f (<next-dist-dir>)
               at g (<next-dist-dir>)
               at h (<next-dist-dir>)
               at i (<next-dist-dir>)
               at j (<next-dist-dir>)
               at k (<next-dist-dir>)
               at l (<next-dist-dir>)
               at m (<next-dist-dir>)
               at n (<anonymous>)
               at o (<next-dist-dir>)
               at main (<anonymous>)
               at body (<anonymous>)
               at html (<anonymous>)
           Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error
           Export encountered an error on /page: /, exiting the build."
          `)
        }
      } else {
        if (inDebugMode) {
          expect(output).toMatchInlineSnapshot(`
           "Error: Route "/": A component accessed data, headers, params, searchParams, or a short-lived cache without a Suspense boundary nor a "use cache" above it. We don't have the exact line number added to error messages yet but you can see which component in the stack below. See more info: https://nextjs.org/docs/messages/next-prerender-missing-suspense
               at LongRunningComponent (<anonymous>)
               at IndirectionTwo (webpack:///app/indirection.tsx:7:33)
               at Page (webpack:///app/page.tsx:19:60)
               at ClientPageRoot (webpack://<next-src>)
               at InnerLayoutRouter (webpack://<next-src>)
               at RedirectErrorBoundary (webpack://<next-src>)
               at RedirectBoundary (webpack://<next-src>)
               at HTTPAccessFallbackErrorBoundary (webpack://<next-src>)
               at HTTPAccessFallbackBoundary (webpack://<next-src>)
               at LoadingBoundary (webpack://<next-src>)
               at ErrorBoundary (webpack://<next-src>)
               at InnerScrollAndFocusHandler (webpack://<next-src>)
               at ScrollAndFocusHandler (webpack://<next-src>)
               at RenderFromTemplateContext (<anonymous>)
               at OuterLayoutRouter (webpack://<next-src>)
               at main (<anonymous>)
               at body (<anonymous>)
               at html (<anonymous>)
              5 | }
              6 |
           >  7 | export function IndirectionTwo({ children }) {
                |                                 ^
              8 |   return children
              9 | }
             10 |
           Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error

           > Export encountered errors on following paths:
           	/page: /"
          `)
        } else {
          expect(output).toMatchInlineSnapshot(`
           "Error: Route "/": A component accessed data, headers, params, searchParams, or a short-lived cache without a Suspense boundary nor a "use cache" above it. We don't have the exact line number added to error messages yet but you can see which component in the stack below. See more info: https://nextjs.org/docs/messages/next-prerender-missing-suspense
               at a (<anonymous>)
               at b (<next-dist-dir>)
               at c (<next-dist-dir>)
               at d (<next-dist-dir>)
               at e (<next-dist-dir>)
               at f (<next-dist-dir>)
               at g (<next-dist-dir>)
               at h (<next-dist-dir>)
               at i (<next-dist-dir>)
               at j (<next-dist-dir>)
               at k (<next-dist-dir>)
               at l (<next-dist-dir>)
               at m (<next-dist-dir>)
               at n (<anonymous>)
               at o (<next-dist-dir>)
               at main (<anonymous>)
               at body (<anonymous>)
               at html (<anonymous>)
           Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error
           Export encountered an error on /page: /, exiting the build."
          `)
        }
      }
    })
  })

  describe('Sync Dynamic - With Fallback - server searchParams', () => {
    const { next, isNextDev, skipped } = nextTestSetup({
      files: __dirname + '/fixtures/sync-server-search-with-fallback',
      skipStart: true,
      skipDeployment: true,
      buildOptions: inDebugMode ? ['--debug-prerender'] : undefined,
    })

    if (skipped) {
      return
    }

    if (isNextDev) {
      it('does not run in dev', () => {})
      return
    }

    it('should not error the build when synchronously reading search params in a client component if all dynamic access is inside a Suspense boundary', async () => {
      try {
        await next.start()
      } catch {
        throw new Error('expected build not to fail for fully static project')
      }

      expect(next.cliOutput).toContain('◐ / ')
      const $ = await next.render$('/')
      expect($('[data-fallback]').length).toBe(2)
    })
  })

  describe('Sync Dynamic - Without Fallback - server searchParams', () => {
    const { next, isNextDev, isTurbopack, skipped } = nextTestSetup({
      files: __dirname + '/fixtures/sync-server-search-without-fallback',
      skipStart: true,
      skipDeployment: true,
      buildOptions: inDebugMode ? ['--debug-prerender'] : undefined,
    })

    if (skipped) {
      return
    }

    if (isNextDev) {
      it('does not run in dev', () => {})
      return
    }

    it('should error the build if dynamic IO happens in the root (outside a Suspense)', async () => {
      try {
        await next.start()
      } catch {
        // we expect the build to fail
      }

      const output = getPrerenderOutput(next.cliOutput, {
        isMinified: !inDebugMode,
      })

      if (isTurbopack) {
        if (inDebugMode) {
          expect(output).toMatchInlineSnapshot(`
           "Error: Route "/" used \`searchParams.foo\`. \`searchParams\` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
               at SearchParamsReadingComponent (turbopack:///[project]/app/page.tsx:40:4)
             38 |   const fooParams = (
             39 |     searchParams as unknown as UnsafeUnwrappedSearchParams<typeof searchParams>
           > 40 |   ).foo
                |    ^
             41 |   return (
             42 |     <div>
             43 |       this component read the accessed the \`foo\` search param: {fooParams}
           Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error

           > Export encountered errors on following paths:
           	/page: /"
          `)
        } else {
          expect(output).toMatchInlineSnapshot(`
           "Error: Route "/" used \`searchParams.foo\`. \`searchParams\` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
               at a (<next-dist-dir>)
               at b (<next-dist-dir>)
               at c (<next-dist-dir>)
           Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error
           Export encountered an error on /page: /, exiting the build."
          `)
        }
      } else {
        if (inDebugMode) {
          expect(output).toMatchInlineSnapshot(`
           "Error: Route "/" used \`searchParams.foo\`. \`searchParams\` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
               at SearchParamsReadingComponent (webpack:///app/page.tsx:40:4)
             38 |   const fooParams = (
             39 |     searchParams as unknown as UnsafeUnwrappedSearchParams<typeof searchParams>
           > 40 |   ).foo
                |    ^
             41 |   return (
             42 |     <div>
             43 |       this component read the accessed the \`foo\` search param: {fooParams}
           Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error

           > Export encountered errors on following paths:
           	/page: /"
          `)
        } else {
          expect(output).toMatchInlineSnapshot(`
           "Error: Route "/" used \`searchParams.foo\`. \`searchParams\` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
               at a (<next-dist-dir>)
               at b (<next-dist-dir>)
               at c (<next-dist-dir>)
           Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error
           Export encountered an error on /page: /, exiting the build."
          `)
        }
      }
    })
  })

  describe('Sync Dynamic - With Fallback - cookies', () => {
    const { next, isNextDev, skipped } = nextTestSetup({
      files: __dirname + '/fixtures/sync-cookies-with-fallback',
      skipStart: true,
      skipDeployment: true,
      buildOptions: inDebugMode ? ['--debug-prerender'] : undefined,
    })

    if (skipped) {
      return
    }

    if (isNextDev) {
      it('does not run in dev', () => {})
      return
    }

    it('should not error the build when synchronously reading search params in a client component if all dynamic access is inside a Suspense boundary', async () => {
      try {
        await next.start()
      } catch {
        throw new Error('expected build not to fail for fully static project')
      }

      expect(next.cliOutput).toContain('◐ / ')
      const $ = await next.render$('/')
      expect($('[data-fallback]').length).toBe(2)
    })
  })

  describe('Sync Dynamic - Without Fallback - cookies', () => {
    const { next, isNextDev, isTurbopack, skipped } = nextTestSetup({
      files: __dirname + '/fixtures/sync-cookies-without-fallback',
      skipStart: true,
      skipDeployment: true,
      buildOptions: inDebugMode ? ['--debug-prerender'] : undefined,
    })

    if (skipped) {
      return
    }

    if (isNextDev) {
      it('does not run in dev', () => {})
      return
    }

    it('should error the build if dynamic IO happens in the root (outside a Suspense)', async () => {
      try {
        await next.start()
      } catch {
        // we expect the build to fail
      }

      const output = getPrerenderOutput(next.cliOutput, {
        isMinified: !inDebugMode,
      })

      if (isTurbopack) {
        if (inDebugMode) {
          expect(output).toMatchInlineSnapshot(`
           "Error: Route "/" used \`cookies().get('token')\`. \`cookies()\` should be awaited before using its value. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
               at CookiesReadingComponent (turbopack:///[project]/app/page.tsx:32:66)
             30 | async function CookiesReadingComponent() {
             31 |   await new Promise((r) => process.nextTick(r))
           > 32 |   const _token = (cookies() as unknown as UnsafeUnwrappedCookies).get('token')
                |                                                                  ^
             33 |   return <div>this component read the \`token\` cookie synchronously</div>
             34 | }
             35 |
           Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error

           > Export encountered errors on following paths:
           	/page: /"
          `)
        } else {
          expect(output).toMatchInlineSnapshot(`
           "Error: Route "/" used \`cookies().get('token')\`. \`cookies()\` should be awaited before using its value. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
               at a (<next-dist-dir>)
               at b (<next-dist-dir>)
               at c (<next-dist-dir>)
           Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error
           Export encountered an error on /page: /, exiting the build."
          `)
        }
      } else {
        if (inDebugMode) {
          expect(output).toMatchInlineSnapshot(`
           "Error: Route "/" used \`cookies().get('token')\`. \`cookies()\` should be awaited before using its value. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
               at createCookiesAccessError (webpack://<next-src>)
               at Promise.get (webpack://<next-src>)
               at CookiesReadingComponent (webpack:///app/page.tsx:32:66)
             579 | ) {
             580 |   const prefix = route ? \`Route "\${route}" \` : 'This route '
           > 581 |   return new Error(
                 |         ^
             582 |     \`\${prefix}used \${expression}. \` +
             583 |       \`\\\`cookies()\\\` should be awaited before using its value. \` +
             584 |       \`Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis\`
           Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error

           > Export encountered errors on following paths:
           	/page: /"
          `)
        } else {
          expect(output).toMatchInlineSnapshot(`
           "Error: Route "/" used \`cookies().get('token')\`. \`cookies()\` should be awaited before using its value. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
               at a (<next-dist-dir>)
               at b (<next-dist-dir>)
               at c (<next-dist-dir>)
           Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error
           Export encountered an error on /page: /, exiting the build."
          `)
        }
      }
    })
  })
})
