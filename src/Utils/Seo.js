import React from 'react'
import { Helmet } from 'react-helmet';


export default function Seo({title = 'Dashboard', description = 'Title.'}) {
  return (
    <Helmet>
        <title>Care Connect — {title}</title>
        <meta name="title" content={`Care Connect — ${title}`} />
        <meta name="description" content={description} />

  </Helmet>
  )
}
