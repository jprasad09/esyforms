import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Provider } from "react-redux"

import FormListing from './pages/FormListing'
import CreateForm from "./pages/CreateForm"
import FillForm from "./pages/FillForm"
import store from "./store"

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/form/:id" element={<FillForm />} />
          <Route exact path="/form/create" element={<CreateForm />} />
          <Route exact path="/" element={<FormListing />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )

}

export default App
