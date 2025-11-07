export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100" 
        className="w-8 h-8 mr-3"
        role="img" 
        aria-label="ViralShort Logo"
      >
        <circle cx="50" cy="50" r="48" fill="#000" />
        <polygon 
          points="36,28 36,72 72,50" 
          fill="none" 
          stroke="#fff" 
          strokeWidth="6" 
          strokeLinejoin="round" 
          strokeLinecap="round"
        />
      </svg>
      <span className="text-2xl font-bold text-white">ViralShort</span>
    </div>
  )
}
