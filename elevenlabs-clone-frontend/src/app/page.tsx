import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {IoMicOutline, IoRocketOutline, IoSparklesOutline} from "react-icons/io5";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/better-auth";


export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session) redirect("/speech-synthesis/text-to-speech");

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/*Header*/}
      <header className='fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm'>
        <nav className='container mx-auto flex h-16 items-center justify-between px-6'>
          <Link href="/" className='flex items-center space-x-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-black'>
              <span className='text-lg font-bold text-white'>D</span>
            </div>
            <span className='text-xl font-semibold'>Darkin</span>
          </Link>

          <div className='flex items-center space-x-4'>
            <Link href='/auth/sign-in'>
              <Button variant='ghost' className='text-sm'>
                Sign In
              </Button>
            </Link>
            <Link href='/auth/sign-up'>
              <Button className='bg-black text-sm text-white hover:bg-gray-800'>
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/*Hero Section*/}
      <section className='container mx-auto px-6 pt-32 pb-20'>
        <div className='mx-auto max-w-4xl text-center'>
          <div className='mb-6 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm'>
            <IoSparklesOutline className='mr-2 h-4 w-4'/>
            <span className='text-gray-700'>AI-Powered Voice Technology</span>
          </div>

          <h1 className='mb-6 text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl lg:text-7xl'>
            Transform Text Into
            <br/>
            <span className='bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
              Lifelike Speech
            </span>
          </h1>

          <p className='mx-auto mb-10 max-w-2xl text-lg text-gray-600 md:text-xl'>
            Create natural-sounding voices for your content. Generate speech, change voices,
            and produce sound effects with cutting-edge AI technology.
          </p>

          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Link href="/auth/sign-up">
              <Button className='h-12 bg-black px-8 text-base text-white hover:bg-gray-800 hover:cursor-pointer'>
                Start Creating Free
              </Button>
            </Link>
            <Link href="/auth/sign-in">
              <Button variant='outline' className='h-12 border-gray-300 px-8 text-base'>
                View Demo
              </Button>
            </Link>
          </div>

          <p className='mt-4 text-sm text-gray-500'>
            No credit card required • Free trial included
          </p>
        </div>
      </section>

      {/*Feature Section*/}
      <section className='border-t border-gray-100 bg-gray-50 py-20'>
        <div className='container mx-auto px-6'>
          <div className='mx-auto max-w-4xl text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl'>
              Everything you need for voice creation
            </h2>
            <p className='mb-16 text-lg text-gray-600'>
              Professional-grade tools designed for creators, developers, and businesses
            </p>
          </div>

          <div className='mx-auto grid max-w-6xl gap-8 md:grid-cols-3'>
            {/*Feature 1*/}
            <div className='rounded-2xl border border-gray-200 bg-white p-8'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100'>
                <IoMicOutline className='h-6 w-6 text-gray-900'/>
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                Text to Speech
              </h3>
              <p className='text-gray-600'>
                Convert any text into natural-sounding speech with multiple voice options
                and customizable settings.
              </p>
            </div>

            {/*Feature 2*/}
            <div className='rounded-2xl border border-gray-200 bg-white p-8'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100'>
                <IoSparklesOutline className='h-6 w-6 text-gray-900'/>
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                Voice Conversion
              </h3>
              <p className='text-gray-600'>
                Transform your voice recordings into different voices while maintaining
                natural intonation and emotion.
              </p>
            </div>

            {/*Feature 3*/}
            <div className='rounded-2xl border border-gray-200 bg-white p-8'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100'>
                <IoRocketOutline className='h-6 w-6 text-gray-900'/>
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                Sound Effects
              </h3>
              <p className='text-gray-600'>
                Generate realistic sound effects from text descriptions for your
                projects and connect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*Stats Section*/}
      <section className='border-t border-gray-100 py-20'>
        <div className='container mx-auto px-6'>
          <div className='mx-auto grid max-w-4xl gap-12 md:grid-cols-3'>
            <div className='text-center'>
              <div className='mb-2 text-4xl font-bold text-gray-900'>50+</div>
              <div className='text-sm text-gray-600'>Voice Options</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-4xl font-bold text-gray-900'>99.9%</div>
              <div className='text-sm text-gray-600'>Uptime</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-4xl font-bold text-gray-900'>Fast</div>
              <div className='text-sm text-gray-600'>Generation Time</div>
            </div>
          </div>
        </div>
      </section>

      {/*CTA Section*/}
      <section className='border-t border-gray-100 bg-gray-50 py-20'>
        <div className='container mx-auto px-6'>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl'>
              Ready to get started?
            </h2>
            <p className='mb-8 text-lg text-gray-600'>
              Join thousands of creators using Darkin to bring their content to life
            </p>
            <Link href="/auth/sign-up">
              <Button className='h-12 bg-black px-8 text-base text-white hover:bg-gray-800'>
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/*Footer*/}
      <footer className='border-t border-gray-100 py-12'>
        <div className='container mx-auto px-6'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <div className='flex items-center space-x-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-black'>
                <span className='text-lg font-bold text-white'>D</span>
              </div>
              <span className='text-xl font-semibold'>Darkin</span>
            </div>

            <div className='flex flex-wrap justify-center gap-6 text-sm text-gray-600'>
              <Link href='/' className='hover:text-gray-900'>
                Terms
              </Link>
              <Link href='/' className='hover:text-gray-900'>
                Privacy
              </Link>
              <Link href='/' className='hover:text-gray-900'>
                Documentation
              </Link>
              <Link href='/' className='hover:text-gray-900'>
                Support
              </Link>
            </div>

            <p className='text-sm text-gray-500'>
              © 2025 Darkin. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
