const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative flex flex-col items-center gap-4">

        {/* Glow background */}
        <div className="absolute h-24 w-24 animate-pulse rounded-full bg-teal-400/10 blur-2xl" />

        {/* Spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent" />
        </div>

        {/* Message */}
        <p className="text-sm font-medium text-slate-500 tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Loading;