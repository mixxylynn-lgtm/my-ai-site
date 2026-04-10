// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold tracking-tighter">
            Copy<span className="text-yellow-400">AI</span> Pro
          </span>
        </div>
        <Link
          href="/generator"
          className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 transition-colors text-black font-semibold rounded-xl"
        >
          Get Started Free
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-7xl md:text-[5.5rem] font-bold tracking-tighter leading-none mb-8">
            Copy that converts.<br />
            <span className="text-yellow-400">Generated in seconds.</span>
          </h1>

          <p className="text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
            Stop staring at a blank page. CopyAI Pro writes high-converting copy 
            for your brand instantly using Claude.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/generator"
              className="px-12 py-5 bg-yellow-400 hover:bg-yellow-300 transition-all text-black font-bold text-xl rounded-2xl"
            >
              Try It Free — 3 Generations
            </Link>
            <Link
              href="/generator"
              className="px-12 py-5 border border-white/30 hover:bg-white/5 transition-all font-semibold text-xl rounded-2xl"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight mb-4">
              Simple, honest pricing.
            </h2>
            <p className="text-xl text-gray-400">Choose what works for you. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-10 flex flex-col">
              <h3 className="text-2xl font-semibold mb-1">Starter</h3>
              <p className="text-gray-400 mb-8">Perfect for solo creators</p>
              <div className="mb-10">
                <span className="text-6xl font-bold">$9</span>
                <span className="text-gray-400">/mo</span>
              </div>
              <ul className="space-y-5 mb-12 flex-1 text-gray-300">
                <li>✓ 50 generations per month</li>
                <li>✓ 5 copy templates</li>
                <li>✓ Email support</li>
              </ul>
              <Link href="/generator" className="mt-auto border border-white/30 hover:bg-white/5 py-4 rounded-2xl text-center font-medium">
                Get Starter
              </Link>
            </div>

            {/* Pro - Most Popular */}
            <div className="bg-zinc-950 border-2 border-yellow-400 rounded-3xl p-10 flex flex-col relative scale-105">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-sm font-bold px-8 py-1.5 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-semibold mb-1">Pro</h3>
              <p className="text-gray-400 mb-8">For growing businesses</p>
              <div className="mb-10">
                <span className="text-6xl font-bold text-yellow-400">$29</span>
                <span className="text-gray-400">/mo</span>
              </div>
              <ul className="space-y-5 mb-12 flex-1 text-gray-300">
                <li>✓ Unlimited generations</li>
                <li>✓ 30+ copy templates</li>
                <li>✓ Priority support</li>
                <li>✓ Brand voice settings</li>
              </ul>
              <Link href="/generator" className="mt-auto bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-2xl text-center font-semibold">
                Get Pro
              </Link>
            </div>

            {/* Business */}
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-10 flex flex-col">
              <h3 className="text-2xl font-semibold mb-1">Business</h3>
              <p className="text-gray-400 mb-8">Full-scale for teams</p>
              <div className="mb-10">
                <span className="text-6xl font-bold">$69</span>
                <span className="text-gray-400">/mo</span>
              </div>
              <ul className="space-y-5 mb-12 flex-1 text-gray-300">
                <li>✓ Everything in Pro</li>
                <li>✓ Team seats (5 users)</li>
                <li>✓ API access</li>
                <li>✓ Dedicated manager</li>
              </ul>
              <Link href="/generator" className="mt-auto border border-white/30 hover:bg-white/5 py-4 rounded-2xl text-center font-medium">
                Get Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-gray-500 border-t border-white/10">
        © 2026 CopyAI Pro • Built with Claude
      </footer>
    </div>
  );
}