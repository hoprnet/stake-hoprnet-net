import React from 'react';
import NextHead from 'next/head'

const Head = () => {
  return (
    <NextHead>
      <title>HOPR | Node Registry</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href="https://hoprnet.org/" />
      <meta name="theme-color" content="#ffffa0" />
      <meta
        name="description"
        content="The HOPR protocol ensures everyone has control of their privacy and data."
      />
      <meta charSet="utf-8" />
      <meta name="keywords" content="crypto, data privacy, network-level" />
      <meta name="author" content="HOPR | Michał Jadach" />
      <meta name="copyright" content="HOPR" />
      {/*<meta name="robots" content="index,nofollow" />*/}
      <meta httpEquiv="cache-control" content="no-cache" />
      <meta httpEquiv="expires" content="43200" />
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
      <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet"/>
      {/* <script src="https://cdn.usefathom.com/script.js" data-site="" defer></script> */}
    </NextHead>
  );
};

export default Head;


