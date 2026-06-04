export default function Input({ label, id, className = "", ...props }) {
  return (
    <label htmlFor={id} className="block">
      {label ? (
        <span className="mb-2 block text-sm font-semibold text-[#0F172A]">
          {label}
        </span>
      ) : null}
      <input id={id} className={`input-field ${className}`} {...props} />
    </label>
  );
}
