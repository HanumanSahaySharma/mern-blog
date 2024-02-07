import { Spinner } from "flowbite-react";
export default function Loader({ className, color, size }) {
  return (
    <>
      <Spinner color={color} aria-label="Spinner Loader" className={className} size={size} />
      <span className="pl-2">Loading...</span>
    </>
  );
}
