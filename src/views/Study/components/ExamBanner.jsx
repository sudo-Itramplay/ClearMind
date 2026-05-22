import React from 'react';
import { useExams } from '../../../context/ExamContext';
import { daysUntil } from '../../../utils/date';

const fmtDate = (key) => {
  const [y, m, d] = key.split("-");
  return `${d}/${m}/${y}`;
};

const ExamBanner = () => {
  const { nextExam } = useExams();
  if (!nextExam) return null;

  const n = daysUntil(nextExam.date);
  const when = n <= 0 ? "Today" : n === 1 ? "Tomorrow" : `${n} days`;
  const urgent = n <= 3;

  return (
    <div className={"exam-banner" + (urgent ? " urgent" : "")} role="status">
      <span className="exam-banner-ring" aria-hidden="true">
        <span className="exam-banner-count">{n <= 0 ? "0" : n}</span>
      </span>
      <div className="exam-banner-text">
        <span className="exam-banner-when">
          {n <= 0 ? "Exam today" : `Next exam in ${when}`}
        </span>
        <span className="exam-banner-label">
          {nextExam.label || "Exam"} · {fmtDate(nextExam.date)}
        </span>
      </div>
    </div>
  );
};

export default ExamBanner;
