"use client";

export default function GlobalError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-black px-5 text-center text-white">
        <main>
          <h1 className="text-5xl font-black uppercase">Something went wrong.</h1>
          <button onClick={unstable_retry} className="mt-8 bg-[#F5C100] px-7 py-4 text-sm font-black uppercase tracking-widest text-black">Try again</button>
        </main>
      </body>
    </html>
  );
}
