export function TutorProfileSkeleton() {
  return (
    <div className="page-enter max-w-[720px] animate-pulse">
      {/* ── Header ── */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <div className="skeleton h-8 w-40 mb-2" />
          <div className="skeleton h-4 w-52" />
        </div>

        <div className="skeleton h-10 w-28 rounded-xl" />
      </div>

      {/* ── Identity card ── */}
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-5 mb-5">
          {/* avatar */}
          <div className="skeleton h-[68px] w-[68px] rounded-[14px] shrink-0" />

          {/* name/title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="skeleton h-6 w-48" />
              <div className="skeleton h-5 w-16 rounded-full" />
            </div>

            <div className="skeleton h-4 w-64" />
          </div>

          {/* rate */}
          <div className="skeleton h-10 w-20 rounded-full shrink-0" />
        </div>

        {/* bio */}
        <div className="space-y-2">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-[85%]" />
        </div>

        {/* stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl p-3 border border-[var(--border)]"
              style={{ background: "var(--bg2)" }}
            >
              <div className="skeleton h-5 w-5 mx-auto mb-2 rounded-full" />

              <div className="skeleton h-5 w-12 mx-auto mb-1" />

              <div className="skeleton h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Courses ── */}
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="skeleton h-5 w-20" />
          <div className="skeleton h-4 w-10" />
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="skeleton h-8 rounded-full"
              style={{
                width: `${70 + i * 10}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Availability ── */}
      <div className="card p-6">
        <div className="skeleton h-5 w-40 mb-4" />

        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton h-4 w-8" />

              <div className="skeleton h-7 w-40 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}