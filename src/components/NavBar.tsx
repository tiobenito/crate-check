"use client";

type View = "landing" | "workstation" | "collection";

interface NavBarProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const navLinks: { label: string; view: View }[] = [
  { label: "Home", view: "landing" },
  { label: "Valuate", view: "workstation" },
  { label: "Collection", view: "collection" },
];

export default function NavBar({ activeView, onNavigate }: NavBarProps) {
  return (
    <nav
      className="sticky top-0 z-100 border-b border-border backdrop-blur-[10px]"
      style={{ background: "var(--bg)", height: 64, padding: "0 40px" }}
    >
      <div className="h-full flex items-center justify-between">
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-3 cursor-pointer bg-transparent border-none p-0"
        >
          <div className="vinyl-logo" />
          <span className="font-display font-black text-xl text-terracotta">
            Crate Check
          </span>
        </button>
        <div className="flex gap-8">
          {navLinks.map(({ label, view }) => (
            <button
              key={view}
              onClick={() => onNavigate(view)}
              className={`text-[0.9rem] font-semibold py-1 bg-transparent border-none cursor-pointer transition-colors ${
                activeView === view
                  ? "text-terracotta border-b-2 border-terracotta pb-0.5"
                  : "text-muted hover:text-terracotta"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
