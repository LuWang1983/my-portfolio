import React from 'react';
import { navigateTo } from '../util/routing';

export default function Link(props) {
  return (
    <a
      href={props.to}
      onClick={(event) => {
        event.preventDefault();
        navigateTo(props.to);
      }}
    >
      {props.children}
    </a>
  );
}
