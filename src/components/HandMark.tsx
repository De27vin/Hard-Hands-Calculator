export function HandMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 360 360" fill="none" aria-hidden="true">
      <path
        d="M106 293 82 226 57 187q-10-17 4-29 14-10 25 3l22 22V91q0-19 18-19t18 19v57-88q0-20 18-20t18 20v87-91q0-19 18-19t18 19v91-70q0-18 18-18t18 18v100l14-21q13-18 28-9t5 29l-37 91-14 27v40H106Z"
        fill="currentColor"
      />
      <path
        d="M108 183v36m36-71v45m36-46v44m36-44v48m-72 22 51-2q29 1 36 34M127 289h105"
        stroke="var(--hand-line, #141413)"
        strokeWidth="7"
        strokeLinecap="square"
      />
    </svg>
  );
}
