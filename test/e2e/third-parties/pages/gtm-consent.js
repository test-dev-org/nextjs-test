import React from 'react'
import { GoogleTagManager, sendGTMEvent } from '@next/third-parties/google'

/**
 * Test page for GTM consent management functionality
 * Demonstrates compatibility with multiple CMP platforms
 * @returns {React.ReactElement} The test page component
 */
const Page = () => {
  /**
   * Handle button click to send GTM event
   * @returns {void}
   */
  const onClick = () => {
    sendGTMEvent({ event: 'buttonClicked', value: 'consent-test' })
  }

  return (
    <div className="container">
      <h1>GTM Consent Management</h1>

      {/* Standard GTM without consent */}
      <GoogleTagManager gtmId="GTM-STANDARD" />

      {/* GTM with Usercentrics consent management */}
      <GoogleTagManager
        gtmId="GTM-USERCENTRICS"
        type="text/plain"
        data-usercentrics="Google Tag Manager"
      />

      {/* GTM with OneTrust consent management */}
      <GoogleTagManager
        gtmId="GTM-ONETRUST"
        type="text/plain"
        data-one-trust-category="C0002"
      />

      {/* GTM with Cookiebot consent management */}
      <GoogleTagManager
        gtmId="GTM-COOKIEBOT"
        type="text/plain"
        data-cookieconsent="statistics"
      />

      {/* GTM with Didomi consent management */}
      <GoogleTagManager
        gtmId="GTM-DIDOMI"
        type="text/plain"
        data-didomi-purposes="analytics"
      />

      {/* GTM with custom consent management */}
      <GoogleTagManager
        gtmId="GTM-CUSTOM"
        type="text/plain"
        data-consent-category="analytics"
        data-consent-required="true"
      />

      <button id="gtm-consent-send" onClick={onClick}>
        Send Event
      </button>
    </div>
  )
}

export default Page
