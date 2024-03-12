import { Spinner } from "flowbite-react";
export default function Loader({ className, color, size }) {
  return (
    <div className={className}>
      <Spinner color={color} aria-label="Spinner Loader" size={size} />
      <span className="hidden" aria-label="loading">
        Loading...
      </span>
    </div>
  );
}
