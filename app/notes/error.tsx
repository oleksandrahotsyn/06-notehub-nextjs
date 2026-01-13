"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorMessage({ error, reset }: Props) {
  return (
    <div role="alert">
      <p>Could not fetch the list of notes.</p>

      {/* Опційно: показати технічну помилку */}
      <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>

      <button type="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
