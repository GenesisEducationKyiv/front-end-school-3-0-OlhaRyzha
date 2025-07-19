import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ROOT, TRACKS } from '@/constants/route.constant';

const HomePage: FC = () => (
  <section className='min-h-screen flex flex-col items-center justify-center gap-6 text-center'>
    <h1 className='text-3xl font-bold tracking-tight'>
      Welcome to Tracks&nbsp;Manager
    </h1>

    <p className='max-w-md text-muted-foreground'>
      Upload, edit and keep your music library organised in one place.
    </p>

    <Link
      to={`${ROOT}${TRACKS}`}
      data-testid='go-to-tracks'
      className='w-40 h-12 flex items-center justify-center bg-primary text-primary-foreground rounded-lg text-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50'
      aria-label='Go to Tracks page'>
      Go to Tracks
    </Link>
  </section>
);

export default HomePage;
