const messages = [
  "FUNCTION FIRST. ALWAYS",
  "ENGINEERED FOR DISCIPLINE",
  "FABRIC INTEGRITY. ALWAYS",
  "SHOW UP WHEN NO ONE'S WATCHING",
  "MINIMAL. PRECISE",
  "CHANGE THAT IS EARNED. NOT ASSUMED",
];

export function MarqueeBanner() {
  return (
    <div className="relative z-[70] overflow-hidden bg-brand-black py-2 text-brand-yellow">
      <div className="animate-marquee flex w-max items-center whitespace-nowrap">
        {[false, true].map((duplicate) => (
          <div
            key={duplicate ? "duplicate" : "primary"}
            aria-hidden={duplicate || undefined}
            className="flex items-center"
          >
            {messages.map((message) => (
              <span key={message} className="flex items-center text-[10px] font-black tracking-[0.22em] sm:text-xs">
                <span aria-hidden="true" className="mx-8 text-brand-yellow">&middot;</span>
                {message}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
