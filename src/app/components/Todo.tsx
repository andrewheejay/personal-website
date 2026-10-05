export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-todo text-xs align-middle">[{children}]</span>
  );
}
