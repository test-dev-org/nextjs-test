import { nextTestSetup } from 'e2e-utils'
import { waitFor } from 'next-test-utils'
import type { NextInstance } from 'e2e-utils'

describe('@next/third-parties basic usage', () => {
  const { next }: { next: NextInstance } = nextTestSetup({
    files: __dirname,
    dependencies: {
      '@next/third-parties': 'canary',
    },
  })

  it('renders YoutubeEmbed', async () => {
    const $ = await next.render$('/youtube-embed')

    const baseContainer = $('[data-ntpc="YouTubeEmbed"]')
    const youtubeContainer = $('lite-youtube')
    expect(baseContainer.length).toBe(1)
    expect(youtubeContainer.length).toBe(1)
  })

  it('renders GoogleMapsEmbed', async () => {
    const $ = await next.render$('/google-maps-embed')

    const baseContainer = $('[data-ntpc="GoogleMapsEmbed"]')
    const mapContainer = $(
      '[src^="https://www.google.com/maps/embed/v1/place?key=XYZ"]'
    )
    expect(baseContainer.length).toBe(1)
    expect(mapContainer.length).toBe(1)
  })

  it('renders GTM', async () => {
    const browser = await next.browser('/gtm')

    await browser.waitForElementByCss('#_next-gtm')
    await waitFor(1000)

    const gtmInlineScript = await browser.elementsByCss('#_next-gtm-init')
    expect(gtmInlineScript.length).toBe(1)

    const gtmScript = await browser.elementsByCss(
      '[src^="https://www.googletagmanager.com/gtm.js?id=GTM-XYZ"]'
    )

    expect(gtmScript.length).toBe(1)

    const dataLayer: unknown[] = await browser.eval('window.dataLayer')
    expect(dataLayer.length).toBe(1)

    await browser.elementByCss('#gtm-send').click()

    const dataLayer2: unknown[] = await browser.eval('window.dataLayer')
    expect(dataLayer2.length).toBe(2)
  })

  it('renders GTM with consent management support', async () => {
    const browser = await next.browser('/gtm-consent')
    await waitFor(1000)

    // Test data for different CMP platforms
    const cmpScenarios = [
      {
        name: 'standard',
        gtmId: 'GTM-STANDARD',
        expectedType: 'application/javascript',
        dataAttribute: null,
        shouldExecute: true,
      },
      {
        name: 'usercentrics',
        gtmId: 'GTM-USERCENTRICS',
        expectedType: 'text/plain',
        dataAttribute: 'data-usercentrics="Google Tag Manager"',
        shouldExecute: false,
      },
      {
        name: 'onetrust',
        gtmId: 'GTM-ONETRUST',
        expectedType: 'text/plain',
        dataAttribute: 'data-one-trust-category="C0002"',
        shouldExecute: false,
      },
      {
        name: 'cookiebot',
        gtmId: 'GTM-COOKIEBOT',
        expectedType: 'text/plain',
        dataAttribute: 'data-cookieconsent="statistics"',
        shouldExecute: false,
      },
      {
        name: 'didomi',
        gtmId: 'GTM-DIDOMI',
        expectedType: 'text/plain',
        dataAttribute: 'data-didomi-purposes="analytics"',
        shouldExecute: false,
      },
      {
        name: 'custom',
        gtmId: 'GTM-CUSTOM',
        expectedType: 'text/plain',
        dataAttribute: 'data-consent-category="analytics"',
        shouldExecute: false,
      },
    ]

    // Test each CMP scenario
    for (const scenario of cmpScenarios) {
      // Verify external GTM script has correct type and attributes
      const externalScripts = await browser.elementsByCss(
        `script[src*="${scenario.gtmId}"][type="${scenario.expectedType}"]`
      )
      expect(externalScripts.length).toBe(1)

      // For consent-managed scripts, verify data attributes are present
      if (scenario.dataAttribute) {
        const scriptsWithDataAttr = await browser.elementsByCss(
          `script[type="${scenario.expectedType}"][${scenario.dataAttribute}]`
        )
        expect(scriptsWithDataAttr.length).toBe(2) // init + external script
      }
    }

    // Verify script execution behavior
    const dataLayer: unknown[] = await browser.eval('window.dataLayer')
    // Only the standard GTM (without consent management) should initialize dataLayer
    expect(dataLayer.length).toBe(1)

    // Verify standard GTM init script has correct default type
    const standardInitType: string | null = await browser.eval(
      'document.querySelector("script[id*=\\"_next-gtm-init\\"]").getAttribute("type")'
    )
    expect(standardInitType).toBe('application/javascript')
  })

  it('renders GA', async () => {
    const browser = await next.browser('/ga')

    await browser.waitForElementByCss('#_next-ga')
    await waitFor(1000)

    const gaInlineScript = await browser.elementsByCss('#_next-ga-init')
    expect(gaInlineScript.length).toBe(1)

    const gaScript = await browser.elementsByCss(
      '[src^="https://www.googletagmanager.com/gtag/js?id=GA-XYZ"]'
    )

    expect(gaScript.length).toBe(1)
    const dataLayer: unknown[] = await browser.eval('window.dataLayer')
    expect(dataLayer.length).toBe(4)

    await browser.elementByCss('#ga-send').click()

    const dataLayer2: unknown[] = await browser.eval('window.dataLayer')
    expect(dataLayer2.length).toBe(5)
  })
})
