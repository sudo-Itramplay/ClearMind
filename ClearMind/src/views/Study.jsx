import React from 'react';

const Study = () => {
  return (
    <section id="center">
      <div>
        <h1>Zona d'Estudi</h1>
        <p>Aquesta és la teva vista central per a tasques d'alta concentració.</p>
        {/* Si necessites un enllaç intern cap a una altra pàgina:
            import { Link } from 'react-router-dom';
            <Link to="/relax" className="counter">Anar a descansar</Link> 
        */}
      </div>
    </section>
  );
};

export default Study;
