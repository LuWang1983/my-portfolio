import React from 'react';

export default function Errors({ errors }) {
  if (!errors) return null;
  return (
    <ul className="errors">
      {errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
}
