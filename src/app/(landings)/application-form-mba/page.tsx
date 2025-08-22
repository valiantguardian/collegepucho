import MBALandingPage from '@/components/page/landing/MBALandingPage';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title:
      "MBA Application Form - CollegePucho : top colleges: courses, admission, ranking, fee, placement",
    keywords: "",
    description:
      "Find the perfect academic goals & budget. Explore colleges, institutions & program opportunities.",
    metadataBase: new URL("https://www.collegepucho.com"),
    alternates: {
      canonical: "https://www.collegepucho.com/application-form-mba",
      languages: { "en-US": "/en-US", "de-DE": "/de-DE" },
    },
  };

const MBAForm = () => {
  return (
    <div><MBALandingPage /></div>
  )
}

export default MBAForm