import { useState } from "react";
import Navbar from "./components/Navbar";
import BookingPage from "./pages/BookingPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import { AppointmentProvider } from "./context/AppointmentContext";


export default function App() {
  const [page, setPage] = useState("book");
  return (
    <AppointmentProvider>
      <div className="min-h-screen bg-canvas">
        <Navbar page={page} onNavigate={setPage} />
        <main>
          {page === "book" ? (
            <BookingPage onNavigate={setPage} />
          ) : (
            <AppointmentsPage onNavigate={setPage} />
          )}
        </main>
        <footer className="border-t border-slate-200 text-center py-6 text-xs text-slate-400">
          © {new Date().getFullYear()} MentorMeet · For better learning
        </footer>
      </div>
    </AppointmentProvider>
  );
}
