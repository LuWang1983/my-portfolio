import React from 'react';
import Header from './header';
import Link from './link';

export default function NotFound(props) {
  return (
    <>
      <Header />
      <h1>
        Not sure what to do at the path <code>${window.location.pathname}</code>
      </h1>
      <p>
        <Link to="/">Try going back home</Link>
      </p>
    </>
  );
}
