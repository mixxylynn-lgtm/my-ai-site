// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">
            Copy<span className="text-yellow-400">AI</span> Pro
          </span>
        </div>
        <Link
          href="/signin"
          className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 transition-colors text-black font-medium rounded-lg"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter leading-none mb-6">
            Copy that converts.<br />
            <span className="text-yellow-400">Generated in seconds.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10">
            Stop staring at a blank page. CopyAI Pro writes high-converting copy 
            for your brand instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signin"
              className="px-10 py-4 bg-yellow-400 hover:bg-yellow-300 transition-all text-black font-semibold text-lg rounded-xl inline-block"
            >
              Get Started Free
            </Link>
            
            <a
              href="#pricing"
              className="px-10 py-4 border border-white/30 hover:bg-white/5 transition-all font-semibold text-lg rounded-xl inline-block"
            >
              See Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Trust / Simple line */}
      <div className="text-center pb-16">
        <p className="text-gray-500 text-sm tracking-widest">
          POWERED BY CLAUDE • INSTANT • NO CREDIT CARD REQUIRED
        </p>
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight mb-4">
              Simple, honest pricing.
            </h2>
            <p className="text-gray-400 text-xl">
              Choose the plan that fits your needs. Upgrade or cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 flex flex-col">
              <h3 className="text-2xl font-semibold mb-2">Starter</h3>
              <p className="text-gray-400 mb-8">Perfect for solo creators.</p>
              
              <div className="mb-10">
                <span className="text-6xl font-bold">$9</span>
                <span className="text-gray-400">/mo</span>
              </div>

              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center gap-3 text-gray-300">
                  ✓ 50 AI generations/mo
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  ✓ 5 copy templates
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  ✓ Email support
                </li>
              </ul>

              <Link
                href="/signin"
                className="mt-auto border border-white/30 hover:bg-white/5 transition-colors text-center py-4 rounded-2xl font-medium"
              >
                Get Starter
              </Link>
            </div>

            {/* Pro - Most Popular */}
            <div className="bg-zinc-950 border-2 border-yellow-400 rounded-3xl p-8 flex flex-col relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-6 py-1 rounded-full">
                MOST POPULAR
              </div>
              
              <h3 className="text-2xl font-semibold mb-2">Pro</h3>
              <p className="text-gray-400 mb-8">For growing businesses.</p>
              
              <div className="mb-10">
                <span className="text-6xl font-bold text-yellow-400">$29</span>
                <span className="text-gray-400">/mo</span>
              </div>

              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center gap-3 text-gray-300">
                  ✓ Unlimited generations
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  ✓ 30+ copy templates
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  ✓ Priority support
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  ✓ Brand voice settings
                </li>
              </ul>

              <Link
                href="/signin"
                className="mt-auto bg-yellow-400 hover:bg-yellow-300 transition-colors text-black text-center py-4 rounded-2xl font-semibold"
              >
                Get Pro
              </Link>
            </div>

            {/* Business */}
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 flex flex-col">
              <h3 className="text-2xl font-semibold mb-2">Business</h3>
              <p className="text-gray-400 mb-8">Full-scale for teams.</p>
              
              <div className="mb-10">
                <span className="text-6xl font-bold">$69</span>
                <span className="text-gray-400">/mo</span>
              </div>

              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center gap-3 text-gray-300">
                  ✓ Everything in Pro
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  ✓ Team seats (5 users)
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  ✓ API access
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  ✓ Dedicated account manager
                </li>
              </ul>

              <Link
                href="/signin"
                className="mt-auto border border-white/30 hover:bg-white/5 transition-colors text-center py-4 rounded-2xl font-medium"
              >
                Get Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-gray-500 text-sm">
        © 2026 CopyAI Pro • Built with ❤️ and a lot of Claude
      </footer>
    </div>
  );
}