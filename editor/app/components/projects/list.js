import React from 'react';
import Header from '../header';
import Link from '../link';

export default function ListProjects({ projects }) {
  return (
    <>
      <Header />
      <h2>Projects</h2>
      <ul className="project-list">
        {projects.map((project) => {
          return (
            <li className="project-list-item" key={project.id}>
              <p>{project.title}</p>
              <span className="project-actions">
                <Link to={`/projects/${project.id}/edit`}>edit</Link>
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
