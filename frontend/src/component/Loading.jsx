export const Loading = ({ progress, message }) => {
  return (
    <div className="w-full max-w-xs space-y-4">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
            Status
          </p>
          <p className="text-sm text-zinc-300 font-medium h-5 truncate">
            {message || "Initializing..."}
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-500">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="relative h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
        {/* Progress Fill */}
        <div
          className="absolute h-full bg-zinc-100 transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]"
          style={{ width: `${progress}%` }}
        />
        {/* Shimmer Effect */}
        <div className="absolute inset-0 loader-bg opacity-10 animate-shimmer pointer-events-none"></div>
      </div>

      <div className="flex justify-center pt-2">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-zinc-700 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
