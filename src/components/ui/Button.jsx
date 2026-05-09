import React from 'react';
import { useSoundCtx } from '../../context/SoundContext';

const Button = ({
  variant = "primary",
  pill,
  children,
  className = "",
  sound = "click",
  onClick,
  ...props
}) => {
  const { play } = useSoundCtx();
  const cls = ["btn", `btn-${variant}`, pill ? "btn-pill" : "", className].join(" ").trim();
  const handle = (e) => { try { play && play(sound); } catch (err) {} onClick && onClick(e); };
  return <button className={cls} onClick={handle} {...props}>{children}</button>;
};

export default Button;
