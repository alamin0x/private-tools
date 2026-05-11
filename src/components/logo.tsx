export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M16 2L28.1244 9V23L16 30L3.87564 23V9L16 2Z" fill="url(#logo_grad_refine)"/>
      <path 
        d="M10 11H22M16 11V21" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M13 14H19" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        opacity="0.6"
      />
      <defs>
        <linearGradient id="logo_grad_refine" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stop-color="#7C3AED"/>
          <stop offset="1" stop-color="#06B6D4"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
