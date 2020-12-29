import React, { useState } from 'react';
import Header from '../header';
import Errors from '../errors';
import Link from '../link';
import { navigateTo } from '../../util/routing';

export default function EditProject({ project }) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const hasErrors = Object.keys(errors).length > 0;
  const cannotSubmit = saving;

  async function saveChanges(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
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
      <h2>Edit project "{project.title}"</h2>
      <form onSubmit={saveChanges}>
        <label htmlFor="projectTitle">Project Title</label>
        <input
          type="text"
          name="projectTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Errors errors={errors.title} />

        <label htmlFor="projectDescription">Description</label>
        <textarea
          name="projectDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Errors errors={errors.description} />

        <button type="submit" disabled={cannotSubmit}>
          Save
        </button>
      </form>
      <nav>
        <Link to="/projects">Back to list</Link>
      </nav>
    </>
  );
}
