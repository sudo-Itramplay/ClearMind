import React from 'react';

const BackButton = ({ onClick, label = "Hall" }) => (
  <button className="back-btn" onClick={onClick} aria-label={`Back to ${label}`}>
    <span aria-hidden="true">←</span>
    <span>{label}</span>
  </button>
);

export default BackButton;
