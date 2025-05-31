import { Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';

interface LoaderProps {
  loading: boolean;
}

const Loader = ({ loading }: LoaderProps) => {
  return (
    <div
      data-testid={loading.toString()}
      className='loader-overlay'>
      <Quantum
        size='45'
        speed='1.75'
        color='black'
      />
    </div>
  );
};
export default Loader;
