// Simple API client for Express backend
export async function fetchHello() {
  const res = await fetch('http://localhost:5000/api/hello');
  if (!res.ok) throw new Error('Failed to fetch from backend');
  return res.json();
}

// Fetch all medicines from backend
export async function fetchMedicines() {
  const res = await fetch('http://localhost:5000/api/medicines');
  if (!res.ok) throw new Error('Failed to fetch medicines');
  return res.json();
}
