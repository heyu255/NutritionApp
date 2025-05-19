import Header from './components/layout/Header';
import Dashboard from './components/layout/Dashboard';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-xl mx-auto px-4 py-6 sm:px-6">
        <Header />
        <Dashboard />
      </div>
    </div>
  )
}

export default App
