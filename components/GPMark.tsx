export default function GPMark({
  className = "",
  variant = "solid",
}: {
  className?: string;
  variant?: "solid" | "outline";
}) {
  if (variant === "outline") {
    return (
      <svg viewBox="0 0 64 48" fill="none" className={className} aria-hidden="true">
        <path
          d="M4 20 L26 20 L26 6 L44 6 L30 24 L44 24 L20 44 L26 28 L4 28 Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 20 L26 20 L26 6 L44 6 L30 24 L44 24 L20 44 L26 28 L4 28 Z"
        fill="currentColor"
      />
    </svg>
  );
}
