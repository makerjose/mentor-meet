const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper function to make API requests
async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json', 
        ...options.headers 
      },
    });
  } catch {
    throw new Error('Cannot connect to JSON Server. Run npm run server in another terminal.');
  }
  if (!response.ok) 
    throw new Error(`API request failed (${response.status}).`);

  return response.status === 204 ? null : response.json();
}

// API client functions
export const api = {
  getMentors: () => request('/mentors'),

  getAppointments: () => request('/appointments'),

  createAppointment: (appointment) => request('/appointments', {
     method: 'POST', 
     body: JSON.stringify(appointment) 
    }),

  updateAppointment: (id, changes) => request(`/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  }),

  deleteAppointment: (id) => request(`/appointments/${id}`, {
    method: 'DELETE',
  }),
};
 