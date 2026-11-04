import { useCallback, useEffect, useReducer, useRef } from 'react';
import { Shell } from './components/Shell';
import { Landing } from './pages/Landing';
import { Quiz } from './pages/Quiz';
import { Calculating } from './pages/Calculating';
import { Results } from './pages/Results';
import { initialState, quizReducer } from './lib/quiz';

export default function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const mounted = useRef(false);
  const finish = useCallback(() => dispatch({ type: 'finish' }), []);
  useEffect(() => {
    if (mounted.current) {
      document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    mounted.current = true;
  }, [state.view, state.index]);
  return (
    <Shell onHome={() => dispatch({ type: 'restart' })} isLanding={state.view === 'landing'}>
      {state.view === 'landing' && <Landing onStart={() => dispatch({ type: 'start' })} />}
      {state.view === 'quiz' && <Quiz state={state} dispatch={dispatch} />}
      {state.view === 'calculating' && <Calculating onComplete={finish} />}
      {state.view === 'results' && (
        <Results answers={state.answers} onRestart={() => dispatch({ type: 'restart' })} />
      )}
    </Shell>
  );
}
