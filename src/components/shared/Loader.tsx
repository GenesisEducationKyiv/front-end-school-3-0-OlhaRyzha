import { Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';
import { useEffect } from 'react';

interface LoaderProps {
  loading: boolean;
}

const Loader = ({ loading }: LoaderProps) => {
  useEffect(() => {
    if (loading) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [loading]);

  return loading ? (
    <div
      data-testid='true'
      className='loader-overlay'>
      <Quantum
        size='45'
        speed='1.75'
        color='black'
      />
    </div>
  ) : null;
};

export default Loader;
