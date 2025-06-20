import React from 'react'
import { GoogleTagManager, sendGTMEvent } from '@next/third-parties/google'

/**
 * Test page for GTM consent management functionality
 * Tests standard GTM vs consent-managed GTM behavior
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

      {/* Standard GTM without consent management */}
      <GoogleTagManager gtmId="GTM-STANDARD" />

      {/* GTM with consent management (Usercentrics example) */}
      <GoogleTagManager
        gtmId="GTM-USERCENTRICS"
        type="text/plain"
        data-usercentrics="Google Tag Manager"
      />

      <button id="gtm-consent-send" onClick={onClick}>
        Send Event
      </button>
    </div>
  )
}

export default Page
