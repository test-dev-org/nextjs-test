# Experimental `@next/third-parties`

`@next/third-parties` is a collection of components and utilities that can be used to efficiently load third-party libraries into your Next.js application.

> Note: `@next/third-parties` is still experimental and under active development.

# Usage

## Google Third-Parties

### Google Tag Manager

The `GoogleTagManager` component can be used to instantiate a [Google Tag Manager](https://developers.google.com/tag-manager) container for your page. By default, it fetches the original inline script after hydration occurs on the page.

```js
import { GoogleTagManager } from '@next/third-parties/google'

export default function Page() {
  return <GoogleTagManager gtmId="GTM-XYZ" />
}
```

#### Consent Management

The `GoogleTagManager` component supports consent management platforms by allowing you to control script execution and add data attributes for consent management platforms (CMPs). This implementation works with all major CMP platforms including Usercentrics, OneTrust, Cookiebot, Didomi, and custom solutions.

**Usercentrics Integration:**

```js
import { GoogleTagManager } from '@next/third-parties/google'

export default function Page() {
  return (
    <GoogleTagManager
      gtmId="GTM-XYZ"
      type="text/plain"
      data-usercentrics="Google Tag Manager"
    />
  )
}
```

**OneTrust Integration:**

```js
import { GoogleTagManager } from '@next/third-parties/google'

export default function Page() {
  return (
    <GoogleTagManager
      gtmId="GTM-XYZ"
      type="text/plain"
      data-one-trust-category="C0002"
    />
  )
}
```

**Cookiebot Integration:**

```js
import { GoogleTagManager } from '@next/third-parties/google'

export default function Page() {
  return (
    <GoogleTagManager
      gtmId="GTM-XYZ"
      type="text/plain"
      data-cookieconsent="statistics"
    />
  )
}
```

**Didomi Integration:**

```js
import { GoogleTagManager } from '@next/third-parties/google'

export default function Page() {
  return (
    <GoogleTagManager
      gtmId="GTM-XYZ"
      type="text/plain"
      data-didomi-purposes="analytics"
    />
  )
}
```

**Custom Consent Management:**

```js
import { GoogleTagManager } from '@next/third-parties/google'

export default function Page() {
  return (
    <GoogleTagManager
      gtmId="GTM-XYZ"
      type="text/plain"
      data-consent-category="analytics"
      data-consent-required="true"
    />
  )
}
```

The `type="text/plain"` attribute prevents the script from executing until your consent management platform changes it to `type="application/javascript"`. The `data-*` attributes allow your CMP to identify and manage the script according to your consent configuration.

#### Sending Events

You can send events using the `sendGTMEvent` function:

```js
import { sendGTMEvent } from '@next/third-parties/google'

export default function Page() {
  return (
    <div>
      <GoogleTagManager gtmId="GTM-XYZ" />
      <button
        onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'xyz' })}
      >
        Send Event
      </button>
    </div>
  )
}
```

### YouTube Embed

The `YouTubeEmbed` component is used to load and display a YouTube embed. This component loads faster by using [lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed) under the hood.

```js
import { YouTubeEmbed } from '@next/third-parties/google'

export default function Page() {
  return <YouTubeEmbed videoid="ogfYd705cRs" height={400} />
}
```

### Google Maps Embed

The `GoogleMapsEmbed` component can be used to add a [Google Maps Embed](https://developers.google.com/maps/documentation/embed/get-started) to your page. By default, it uses the `loading` attribute to lazy-load below the fold.

```js
import { GoogleMapsEmbed } from '@next/third-parties/google'

export default function Page() {
  return (
    <GoogleMapsEmbed
      apiKey="XYZ"
      height={200}
      width="100%"
      mode="place"
      q="Brooklyn+Bridge,New+York,NY"
    />
  )
}
```

To get a better idea of how these components work, take a look at this [demo](https://test-next-script-housseindjirdeh.vercel.app/). <!--- TODO: Replace with a better demo page -->
