const BookedSessions = () => {
  return (
    <div
      className="
        min-h-[60vh]
        flex items-center justify-center
        text-center
        px-4
      "
    >
      <div>
        <div className="text-5xl mb-4">📅</div>

        <h2
          className="
            text-xl font-bold
            text-[var(--text)]
            mb-2
          "
        >
          No booked sessions yet
        </h2>

        <p
          className="
            text-sm
            text-[var(--text2)]
          "
        >
          Your booked tutoring sessions will appear here.
        </p>
      </div>
    </div>
  );
};

export default BookedSessions;