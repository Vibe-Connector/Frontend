import { AppModeProvider } from './hooks/useAppMode'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Sidebar from './components/layout/Sidebar'

function App() {
  return (
    <AppModeProvider>
      <div className="app">
        <Sidebar />
        <Header />
        <main className="min-h-screen" />
        <Footer />
      </div>
    </AppModeProvider>
  )
}


export default App;
