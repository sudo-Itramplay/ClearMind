import React from 'react';
import Calendar from './Calendar';
import WallClock from './WallClock';
import Door from './Door';

const DOOR_GLOWS = {
  study:    "rgba(212, 165, 116, 0.35)",
  meditate: "rgba(90, 138, 140, 0.35)",
};

const CenterTable = () => (
  <div className="table" aria-hidden="true">
    <div className="lamp-shade" />
    <div className="lamp-stem" />
    <div className="lamp-base" />
  </div>
);

const Hall = ({ go }) => (
  <div className="hall page-anim">
    <div className="hall-grain" aria-hidden="true" />
    <div className="hall-top">
      <Calendar />
      <WallClock />
    </div>
    <div className="hall-mid">
      <Door
        kind="study"
        label="Study Room"
        glowColor={DOOR_GLOWS.study}
        onClick={() => go("study")}
      />
      <CenterTable />
      <Door
        kind="meditate"
        label="Meditate"
        glowColor={DOOR_GLOWS.meditate}
        onClick={() => go("meditate")}
      />
    </div>
    <div className="hall-floor-wrap" aria-hidden="true">
      <div className="hall-skirting" />
      <div className="hall-floor" />
      <div className="rug" />
    </div>
  </div>
);

export default Hall;
