import { Outlet } from 'react-router-dom';

import AppLayout from '@/app/layout/AppLayout';
import { useAppSelector } from '@/app/Hooks';
import { RootState } from './Store';

const App = () => {
  const auth = useAppSelector((state: RootState) => state.auth);

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default App;
