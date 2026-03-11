import { useEffect, useState } from "react";

const phrases = ["Brewing magic", "Fetching the goods", "Almost there", "Hang tight"];

const LoadingComponent = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(phraseTimer);
  }, []);

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(dotTimer);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center font-mono">
      <div className="flex flex-col items-center gap-10">

        {/* Orbital ring loader */}
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
          {/* Spinning arc */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 border-r-emerald-400"
            style={{ animation: "spin 1s linear infinite" }}
          />
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-3 h-3 rounded-full bg-emerald-400"
              style={{ animation: "pulse 1.2s ease-in-out infinite" }}
            />
          </div>
          {/* Orbiting satellite */}
          <div
            className="absolute inset-0"
            style={{ animation: "spin 1.8s linear infinite reverse" }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-400" />
          </div>
        </div>

        {/* Segmented bar */}
        <div className="flex gap-1.5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-6 rounded-sm bg-emerald-400"
              style={{
                animation: `barPulse 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0.2,
              }}
            />
          ))}
        </div>

        {/* Rotating text message */}
        <div className="text-center">
          <p className="text-zinc-300 text-sm tracking-widest uppercase">
            {phrases[phraseIndex]}
            <span className="inline-block w-6 text-left text-emerald-400">{dots}</span>
          </p>
          <p className="text-zinc-600 text-xs mt-2 tracking-wider">Please wait</p>
        </div>

      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }
        @keyframes barPulse {
          0%, 100% { opacity: 0.2; transform: scaleY(0.6); }
          50% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}


export default LoadingComponent;