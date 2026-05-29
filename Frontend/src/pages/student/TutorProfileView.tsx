import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Stars } from "@/shared/components/ui";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { get_tutor_by_id } from "@/features/tutor/tutorApi";
import { TutorProfileViewSkeleton } from "@/features/tutor/components/TutorProfileViewSkeleton";
import { useEffect, useState } from "react";


export function TutorProfileView() {
  const navigate = useNavigate();
  const { tutorId } = useParams<{ tutorId: string }>();

  const { data: tutor, isLoading, error } = useQuery({
    queryKey: ["tutor", tutorId],
    queryFn: () => get_tutor_by_id(tutorId!),
    initialData: () =>
      queryClient.getQueryData(["tutor", tutorId]),
    enabled: !!tutorId,
    staleTime: 1000 * 60 * 10,
  });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (error) navigate("/student/tutors");
  }, [error, navigate]);

  const loading = isLoading || !tutor;
  if (loading) return <TutorProfileViewSkeleton/>

  return (
      <div className={`page-enter px-1 sm:px-6 lg:px-0 ${mounted ? "opacity-100" : "opacity-0"}`}>

      {/* BACK BUTTON */}
      <button
        className="btn-ghost mb-2 sm:mb-6"
        onClick={() => navigate("/student/tutors")}
      >
        ← Back
      </button>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-5">

          {/* HERO */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-start">

            <Avatar
              name={tutor.full_name}
              imageUrl={tutor.profile_picture_url}
              size={72}
            />

            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text)]">
                {tutor.full_name}
              </h1>

              {tutor.title && (
                <p className="text-sm text-[var(--text2)] mt-1">
                  {tutor.title}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                <Stars rating={Number(tutor.average_rating) || 0} />
                <strong>
                  {Number(tutor.average_rating).toFixed(1)}
                </strong>
                <span className="text-[var(--text2)]">
                  ({tutor.review_count})
                </span>
              </div>

              <p className="text-sm text-[var(--text2)] mt-3 leading-relaxed">
                {tutor.bio}
              </p>

              {/* meta */}
              <div className="flex flex-wrap gap-3 mt-4 text-sm text-[var(--text2)]">
                <span>📚 {tutor.total_sessions}</span>
                <span>💰 ${Number(tutor.hourly_rate ?? 0)}/hr</span>
                <span>
                  {tutor.is_online ? "🟢 Online" : "⚫ Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* COURSES */}
          <div className="card p-4 sm:p-5">
            <h3 className="font-bold mb-3">Courses</h3>

            <div className="flex flex-wrap gap-2">
              {tutor.courses.map((c) => (
                <span key={c.id} className="badge badge-purple">
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-1">

          <div className="card p-4 sm:p-5 lg:sticky lg:top-5 self-start">

            <h3 className="font-bold mb-3">Book Session</h3>

            <div className="text-xl sm:text-2xl font-extrabold text-[var(--accent2)] mb-4">
              ${Number(tutor.hourly_rate ?? 0)}
              <span className="text-sm font-normal text-[var(--text2)]">
                /hr
              </span>
            </div>

            {/* availability */}
            <div className="mb-5">
              <p className="text-sm font-semibold mb-2 text-[var(--text2)]">
                Availability
              </p>

              {tutor.availability ? (
                <div className="space-y-2">
                  {Object.entries(tutor.availability).map(
                    ([day, slot]) => (
                      <div
                        key={day}
                        className="flex justify-between text-sm p-2 rounded border border-[var(--border)]"
                      >
                        <span className="capitalize">{day}</span>
                        <span>
                          {slot.start} - {slot.end}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-[var(--text2)]">
                  No availability set
                </p>
              )}
            </div>

            {/* actions */}
            <button
              className="btn-primary w-full mb-2"
              onClick={() =>
                navigate(`/student/booking/${tutor.user_id}`)
              }
            >
              Request Session
            </button>

            <button
              className="btn-secondary w-full"
              onClick={() => navigate("/student/chat")}
            >
              💬 Message
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}