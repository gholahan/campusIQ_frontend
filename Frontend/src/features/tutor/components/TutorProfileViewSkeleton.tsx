export function TutorProfileViewSkeleton() {
  return (
    <div className="page-enter px-4 sm:px-6 lg:px-0">

      {/* back */}
      <div className="skeleton h-8 w-24 mb-6" />

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-5">

          {/* HERO */}
          <div className="flex flex-col sm:flex-row gap-4">

            <div className="skeleton w-[72px] h-[72px] rounded-full shrink-0" />

            <div className="flex-1 space-y-3">

              <div className="skeleton h-5 w-44" />
              <div className="skeleton h-4 w-28" />
              <div className="skeleton h-4 w-36" />

              <div className="space-y-2 mt-2">
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-5/6" />
              </div>

              <div className="flex flex-wrap gap-3 mt-3">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-4 w-28" />
                <div className="skeleton h-4 w-20" />
              </div>

            </div>
          </div>

          {/* COURSES */}
          <div className="card p-4 sm:p-5 space-y-3">
            <div className="skeleton h-4 w-32" />

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton h-6 w-20 rounded-full"
                />
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="lg:col-span-1">

          <div className="card p-4 sm:p-5 space-y-4 lg:sticky lg:top-5">

            <div className="skeleton h-5 w-32" />
            <div className="skeleton h-7 w-24" />

            {/* availability */}
            <div className="space-y-2">
              <div className="skeleton h-4 w-28 mb-2" />

              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton h-10 w-full"
                />
              ))}
            </div>

            {/* buttons */}
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-10 w-full" />

          </div>
        </div>

      </div>
    </div>
  );
}