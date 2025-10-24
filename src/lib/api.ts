// Simple API client for Express backend
// export async function fetchHello() {
//   const res = await fetch('http://localhost:5000/api/hello');
//   if (!res.ok) throw new Error('Failed to fetch from backend');
//   return res.json();
// }

// Fetch all medicines from backend
export async function fetchMedicines() {
  const res = await fetch('http://localhost:5000/api/medicines');
  if (!res.ok) throw new Error('Failed to fetch medicines');
  return res.json();
}

export async function fetchDoctors() {
  const res = await fetch('http://localhost:5000/api/doctors');
  if (!res.ok) throw new Error('Failed to fetch doctors');
  return res.json();
}

export async function postAppointment(payload: any) {
  const res = await fetch('http://localhost:5000/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create appointment');
  return res.json();
}
