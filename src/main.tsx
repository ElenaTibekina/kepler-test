import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 60000,
        },
    },
});

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </StrictMode>
);
