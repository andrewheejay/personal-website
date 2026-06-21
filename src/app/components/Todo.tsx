export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-todo/80 text-xs align-middle">[{children}]</span>
  );
}
