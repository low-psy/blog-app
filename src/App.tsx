import { useContext, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from 'context/ThemeContext';

import { app } from 'firebaseApp';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { ToastContainer } from 'react-toastify';
import Loader from 'components/Loader';
import Router from './components/Router';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  const context = useContext(ThemeContext);
  const auth = useMemo(() => getAuth(app), []);
  const [init, setInit] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser,
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setInit(true);
    });
  }, [auth]);

  return (
    <div className={context.theme === 'light' ? 'white' : 'dark'}>
      <ToastContainer />
      {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
    </div>
  );
}

export default App;
