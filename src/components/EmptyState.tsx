import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}

export function EmptyState({ title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <section className="coms-card grid min-h-56 place-items-center px-6 py-10 text-center">
      <div className="max-w-md">
        <p className="text-sm font-bold text-[var(--app-accent-text)]">COMS 티어표</p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--app-text)]">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--app-muted)]">{description}</p>
        {actionLabel && actionTo ? (
          <Link className="coms-button-primary mt-6 inline-flex" to={actionTo}>
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
