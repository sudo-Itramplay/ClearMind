import React from 'react';
import { Link } from 'react-router-dom';
import { useTodos } from '../context/TodoContext';
import './css/Hall.css';

function Hall() {
  const { todos } = useTodos();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (

    <div className="hall-container">
      {/* Portes laterals (Sketch concept) */}
      <Link to="/study" className="door left-door">
        <div className="door-label">TASQUES</div>
        <div className="door-frame"></div>
      </Link>

      <section className="center-wall">
        <div className="clock-circle">
          <span className="clock-time">{time}</span>
          <p>RELLOTGE</p>
        </div>

        <div className="calendar-board">
          <h2>CALENDARI / TODOS</h2>
          <ul className="todo-list">
            {[...todos].sort((a, b) => a.completed - b.completed).map(todo => (
              <li key={todo.id} className={todo.completed ? 'done' : ''}>
                {todo.task}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Link to="/relax" className="door right-door">
        <div className="door-label">MEDITACIÓ</div>
        <div className="door-frame"></div>
      </Link>

      {/* La catifa circular del centre del sketch */}
      <div className="rug"></div>
    </div>
  );
}

export default Hall;
