import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Sidebar from './components/layout/Sidebar'

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="ml-sidebar">
        <Header />
        <main className="min-h-screen" />
        <Footer />
      </div>
    </div>
  )
}


export default App;
