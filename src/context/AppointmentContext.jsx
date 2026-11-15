import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../api/client";
import { sessions } from "../data/sessions";
import { isSessionPast, isWeekend } from "../utils/dates";

const AppointmentContext = createContext(null);

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch mentors and appointments from the API
  const refresh = useCallback(async () => {
    try {
      const [nextMentors, nextAppointments] = await Promise.all([
        api.getMentors(),
        api.getAppointments(),
      ]);
      setMentors(nextMentors);
      setAppointments(nextAppointments);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // refresh data on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  // book a new appointment with validation.
  const book = useCallback(
    async ({ date, mentorId, sessionId, studentName, topic }) => {
      if (!studentName?.trim() || !topic?.trim())
        return { ok: false, message: "Enter your name and discussion topic." };
      const session = sessions.find((s) => s.id === sessionId);
      if (!session || isWeekend(date) || isSessionPast(date, session.hour))
        return { ok: false, message: "Select a future weekday session." };
      if (!mentors.some((m) => m.id === mentorId))
        return { ok: false, message: "Select a valid mentor." };
      try {
        // Fetch latest records before writing to avoid booking a slot already taken in another tab.
        const latest = await api.getAppointments();
        setAppointments(latest);

        if (
          latest.some(
            (a) =>
              a.date === date &&
              a.mentorId === mentorId &&
              a.sessionId === sessionId,
          )
        ) {
          return {
            ok: false,
            message: "This session is already booked. Please choose another.",
          };
        }

        const created = await api.createAppointment({
          date,
          mentorId,
          sessionId,
          studentName: studentName.trim(),
          topic: topic.trim(),
        });

        setAppointments((previous) => [
          ...previous.filter((a) => a.id !== created.id),
          created,
        ]);

        setError("");
        return { ok: true };
      } catch (err) {
        return { ok: false, message: err.message };
      }
    },
    [mentors],
  );

  // update an existing appointment with validation
  const updateAppointment = useCallback(
    async (id, changes) => {
      const appointment = appointments.find((a) => a.id === id);

      if (!appointment) {
        return {
          ok: false,
          message: "Appointment not found.",
        };
      }

      const updated = { ...appointment, ...changes };

      if (!updated.studentName?.trim() || !updated.topic?.trim()) {
        return {
          ok: false,
          message: "Student name and topic are required.",
        };
      }

      const session = sessions.find((s) => s.id === updated.sessionId);

      if (
        !session ||
        isWeekend(updated.date) ||
        isSessionPast(updated.date, session.hour)
      ) {
        return {
          ok: false,
          message: "Select a future weekday session.",
        };
      }

      if (!mentors.some((m) => m.id === updated.mentorId)) {
        return {
          ok: false,
          message: "Invalid mentor selected.",
        };
      }

      try {
        const latest = await api.getAppointments();
        setAppointments(latest);

        if (!latest.some((a) => a.id === id)) {
          return {
            ok: false,
            message: "This appointment no longer exists.",
          };
        }

        const alreadyBooked = latest.some(
          (a) =>
            a.id !== id &&
            a.date === updated.date &&
            a.mentorId === updated.mentorId &&
            a.sessionId === updated.sessionId,
        );

        if (alreadyBooked) {
          return {
            ok: false,
            message: "This session is already booked.",
          };
        }

        const saved = await api.updateAppointment(id, {
          date: updated.date,
          mentorId: updated.mentorId,
          sessionId: updated.sessionId,
          studentName: updated.studentName.trim(),
          topic: updated.topic.trim(),
        });

        setAppointments((prev) => prev.map((a) => (a.id === id ? saved : a)));

        return { ok: true };
      } catch (err) {
        return { ok: false, message: err.message };
      }
    },
    [appointments, mentors],
  );

  // delete appointement
  const deleteAppointment = useCallback(async (id) => {
    try {
      await api.deleteAppointment(id);

      setAppointments((prev) => prev.filter((a) => a.id !== id));

      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  }, []);

  // cache the context value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({
      appointments,
      mentors,
      loading,
      error,
      refresh,
      book,
      updateAppointment,
      deleteAppointment,

      getBooking: (date, mentorId, sessionId) =>
        appointments.find(
          (a) =>
            a.date === date &&
            a.mentorId === mentorId &&
            a.sessionId === sessionId,
        ),
    }),
    [
      appointments,
      mentors,
      loading,
      error,
      refresh,
      book,
      updateAppointment,
      deleteAppointment,
    ],
  );
  
  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}

// Custom hook to access the AppointmentContext
export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (!context)
    throw new Error("useAppointments must be used inside AppointmentProvider");
  return context;
}
