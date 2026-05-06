interface FieldErrorProps { message?: string; }

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return <p className="text-[12px] mt-1 text-(--cred)">{message}</p>;
}