'use client'

export default function Page() {
  if (typeof window !== 'undefined') {
    throw new Error('This page should only be rendered on the client side.')
  }
  return <p>page</p>
}
