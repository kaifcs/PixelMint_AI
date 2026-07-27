import { AppErrorBoundary } from "./app/error-boundary";
import { AppProviders } from "./app/providers";
import { AppRouter } from "./app/router/AppRouter";

const App = () => (
  <AppErrorBoundary>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </AppErrorBoundary>
);

export default App;
