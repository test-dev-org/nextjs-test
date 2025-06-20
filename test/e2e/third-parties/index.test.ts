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

  it('renders GTM with consent management for multiple CMP platforms', async () => {
    const browser = await next.browser('/gtm-consent')
    await waitFor(1000)

    // Test standard GTM (should have type="application/javascript" by default)
    const standardScripts = await browser.elementsByCss(
      'script[src*="GTM-STANDARD"]'
    )
    expect(standardScripts.length).toBe(1)

    const standardType: string | null = await browser.eval(
      'document.querySelector("#_next-gtm-init").getAttribute("type")'
    )
    expect(standardType).toBe('application/javascript')

    // Test Usercentrics GTM (should have type="text/plain" and data-usercentrics)
    const usercentricsInitScripts = await browser.elementsByCss(
      'script[type="text/plain"][data-usercentrics="Google Tag Manager"]'
    )
    expect(usercentricsInitScripts.length).toBe(2) // init + external script

    const usercentricsScripts = await browser.elementsByCss(
      'script[src*="GTM-USERCENTRICS"][type="text/plain"]'
    )
    expect(usercentricsScripts.length).toBe(1)

    // Test OneTrust GTM (should have type="text/plain" and data-one-trust-category)
    const onetrustInitScripts = await browser.elementsByCss(
      'script[type="text/plain"][data-one-trust-category="C0002"]'
    )
    expect(onetrustInitScripts.length).toBe(2) // init + external script

    const onetrustScripts = await browser.elementsByCss(
      'script[src*="GTM-ONETRUST"][type="text/plain"]'
    )
    expect(onetrustScripts.length).toBe(1)

    // Test Cookiebot GTM (should have type="text/plain" and data-cookieconsent)
    const cookiebotInitScripts = await browser.elementsByCss(
      'script[type="text/plain"][data-cookieconsent="statistics"]'
    )
    expect(cookiebotInitScripts.length).toBe(2) // init + external script

    const cookiebotScripts = await browser.elementsByCss(
      'script[src*="GTM-COOKIEBOT"][type="text/plain"]'
    )
    expect(cookiebotScripts.length).toBe(1)

    // Test Didomi GTM (should have type="text/plain" and data-didomi-purposes)
    const didomiInitScripts = await browser.elementsByCss(
      'script[type="text/plain"][data-didomi-purposes="analytics"]'
    )
    expect(didomiInitScripts.length).toBe(2) // init + external script

    const didomiScripts = await browser.elementsByCss(
      'script[src*="GTM-DIDOMI"][type="text/plain"]'
    )
    expect(didomiScripts.length).toBe(1)

    // Test custom consent GTM (multiple data attributes)
    const customInitScripts = await browser.elementsByCss(
      'script[type="text/plain"][data-consent-category="analytics"]'
    )
    expect(customInitScripts.length).toBe(2) // init + external script

    const customScripts = await browser.elementsByCss(
      'script[src*="GTM-CUSTOM"][type="text/plain"][data-consent-required="true"]'
    )
    expect(customScripts.length).toBe(1)

    // Test that consent-managed scripts don't execute until consent is given
    const dataLayer: unknown[] = await browser.eval('window.dataLayer')
    // Only the standard GTM should have initialized dataLayer
    expect(dataLayer.length).toBe(1)
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
