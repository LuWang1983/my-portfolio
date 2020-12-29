import React, { useState } from 'react';
import Errors from '../errors';
import Link from '../link';
import Header from '../header';
import { navigateTo } from '../../util/routing';

export default function EditSite({ site }) {
  const [headline, setHeadline] = useState(site.headline);
  const [welcomeMessage, setWelcomeMessage] = useState(site.welcomeMessage);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const hasErrors = Object.keys(errors).length > 0;
  const cannotSubmit = saving;

  async function saveChanges(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/site`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headline, welcomeMessage }),
      });
      switch (response.status) {
        case 200:
          setErrors({});
          break;
        case 422:
          const errors = await response.json();
          setErrors(errors);
          break;
        default:
          throw new Error(`Unexpected HTTP response: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      navigateTo('/application-error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Header />
      <h2>Edit site detalis</h2>
      <form onSubmit={saveChanges}>
        <label htmlFor="headline">Site Headline</label>
        <input
          type="text"
          name="headline"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
        />
        <Errors errors={errors.headline} />

        <label htmlFor="welcomeMessage">Welcome Message</label>
        <textarea
          name="welcomeMessage"
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
        />
        <Errors errors={errors.welcomeMessage} />

        <button type="submit" disabled={cannotSubmit}>
          Save
        </button>
      </form>
    </>
  );
}
