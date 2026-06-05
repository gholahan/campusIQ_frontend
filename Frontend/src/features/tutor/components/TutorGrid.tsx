import { useNavigate } from "react-router-dom";
import { useTutorPrefetch } from "../hooks/useTutorApi";
import { Avatar, Stars } from "@/shared/components";
import { TutorProfileRead } from "../types";

type TutorGridProps = {
  tutors: TutorProfileRead[];
};

const TutorGrid = ({tutors}:TutorGridProps) => {
      const{prefetchTutor, cancelPrefetch} = useTutorPrefetch();
      const navigate = useNavigate();
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
          {tutors.map((t) => (
            <div
              key={t.user_id}
              onMouseEnter={() => prefetchTutor(t.user_id)}
              onMouseLeave={() => cancelPrefetch(t.user_id)}
              onClick={() => navigate(`/student/tutors/${t.user_id}`)}
              className="tutor-card cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={t.full_name} imageUrl={t.profile_picture_url} size={46} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[15px] text-[var(--text)] truncate">{t.full_name}</div>
                  <div className="flex items-center gap-1 text-[13px]">
                    <Stars rating={Number(t.average_rating) || 0} />
                    <span className="text-[var(--text2)] text-xs">
                      {Number(t.average_rating).toFixed(1)} ({t.review_count})
                    </span>
                  </div>
                  {t.is_online
                    ? <span className="text-[11px] text-[var(--cgreen)]">● Online</span>
                    : <span className="text-[11px] text-[var(--text3)]">⚫ Offline</span>
                  }
                </div>
                <div
                  className="shrink-0 text-[12px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: '#EEEDFE', color: '#3C3489' }}
                >
                  ${Number(t.hourly_rate).toLocaleString()}/hr
                </div>
              </div>

              <div className="flex gap-1.5 flex-wrap mb-3">
                {(t.courses ?? []).slice(0, 3).map((c) => (
                  <span key={c.id} className="badge badge-blue">{c.name}</span>
                ))}
              </div>

              <p className="text-[13px] text-[var(--text2)] leading-relaxed mb-3 line-clamp-2">
                {t.bio || 'No bio provided.'}
              </p>

              <div className="flex items-center justify-between text-[12px] text-[var(--text3)]">
                <span>📚 {t.total_sessions} sessions</span>
                <button className="btn-primary text-[12px] py-1.5 px-3">View Profile</button>
              </div>
            </div>
          ))}
        </div>
  )
}

export default TutorGrid