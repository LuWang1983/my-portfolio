import React from 'react';
import Header from './header';

export default function ApplicationError() {
  return (
    <>
      <Header />
      <p>
        An unexpected error occurred that left the application in an
        unrecoverable state.
      </p>
    </>
  );
}
