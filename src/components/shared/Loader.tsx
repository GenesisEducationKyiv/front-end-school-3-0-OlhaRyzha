import { Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';

interface LoaderProps {
  loading: boolean;
}

const Loader = ({ loading }: LoaderProps) => {
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
