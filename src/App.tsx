import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { Home } from './views/Home';
import { loader as orderLoader, OrderStatusView } from './views/OrderStatus';


const router = createBrowserRouter([
  {
    path: "*",
    element: <Home />
  },
  {
    path:":name/:von",
    loader: orderLoader,
    element: <OrderStatusView />,
  }
], {basename: process.env.PUBLIC_URL});


function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
