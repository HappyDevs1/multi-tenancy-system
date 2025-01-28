import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import AddTenant from './components/AddTenant';

function App() {
  return (
    <div className='flex gap-5 bg-slate-50'>
      <Navigation />
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/add' element={<AddTenant />} />
      </Routes>
    </div>
  )
}

export default App