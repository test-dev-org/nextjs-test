import React from 'react'
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/origin">Go to Origin</Link>
    </div>
  )
}
