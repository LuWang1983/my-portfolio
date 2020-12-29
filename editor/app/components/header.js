import React from 'react';
import Link from './link';

export default function Header() {
  return (
    <header>
      <h1>My Portfolio editor</h1>
      <nav>
        <Link to="/site/edit">Edit Site Data</Link>
        <Link to="/projects">List Projects</Link>
      </nav>
    </header>
  );
}
