import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  Outlet,
  RouterProvider,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Details from './components/Details';
import {

  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
const queryClient = new QueryClient()
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <App />
    )
  },
})

const detailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/details/$ID',
  component: function DetailsRoute() {
    return (<>         <Link to="/" className="[&.active]:font-bold">
      Home
    </Link>{' '}<Details /></>)
  },
})
const routeTree = rootRoute.addChildren([indexRoute, detailsRoute])

const router = createRouter({ routeTree })
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
