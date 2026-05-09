import React from 'react';

const Loader = ({ label = "Loading" }) => (
  <div className="loader-wrap" role="status" aria-live="polite">
    <div className="loader" aria-hidden="true" />
    <span className="sr-only">{label}</span>
  </div>
);

export default Loader;
