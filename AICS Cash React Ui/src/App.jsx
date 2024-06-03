import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ROUTES } from "./routes/routes"
import Login from "./pages/Login"
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
      <ToastContainer 
position="top-center" />
      <BrowserRouter>
          <Routes>
            {
              [...ROUTES].map((singleRoute) => (
                    <Route 
                      key={singleRoute.route}
                      path={singleRoute.route}
                      element={
                        localStorage.getItem("token") == null ?
                        <Login /> :
                        <singleRoute.element />
                      }
                    />
              ))
            }
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
