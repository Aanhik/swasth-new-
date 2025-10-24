
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swasth';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Medicine Schema
const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String },
  apolloPrice: { type: Number },
  netmedsPrice: { type: Number },
  apolloLink: { type: String },
  netmedsLink: { type: String },
  pharmeasyPrice: { type: Number },
  pharmeasyLink: { type: String }
});

const Medicine = mongoose.model('Medicine', medicineSchema);

// Collaborator Doctor Schema
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String },
  email: { type: String },
  phone: { type: String },
  experienceYears: { type: Number },
  rating: { type: Number },
  bio: { type: String }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

// Appointment Schema for collaborator bookings
const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  email: { type: String },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  date: { type: Date, required: true },
  symptoms: { type: String },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Seed medicines (run once, comment after first run)
async function seedMedicines() {
  const count = await Medicine.countDocuments();
  if (count > 0) return;
  await Medicine.insertMany([
    { name: 'Paracetamol', img: '', apolloPrice: 20, netmedsPrice: 18, pharmeasyPrice: 19, apolloLink: 'https://www.apollopharmacy.in/otc/paracip-650mg-tablet?doNotTrack=true', netmedsLink: 'https://www.netmeds.com/product/paracip-500mg-tablet-10s-lui1z1-8232799', pharmeasyLink: 'https://www.1mg.com/drugs/crocin-advance-500mg-tablet-600468' },
    { name: 'Ibuprofen', img: '', apolloPrice: 30, netmedsPrice: 28, pharmeasyPrice: 29, apolloLink: 'https://www.apollopharmacy.in/medicine/brufen-600mg-tablet?doNotTrack=true', netmedsLink: 'https://www.netmeds.com/product/combiflam-tablet-20s-lui7zg-8353314', pharmeasyLink: 'https://www.1mg.com/drugs/brufen-400-tablet-1002088' },
    { name: 'Amoxicillin', img: '', apolloPrice: 50, netmedsPrice: 48, pharmeasyPrice: 49, apolloLink: 'https://www.apollopharmacy.in/search-medicines?source=/search-medicines', netmedsLink: 'https://www.netmeds.com/product/augmentin-625-duo-tablet-10s-lui7t5-8350103', pharmeasyLink: 'https://www.1mg.com/drugs/alkem-amoxicillin-250mg-capsule-275872' },
    { name: 'Cetirizine', img: '', apolloPrice: 15, netmedsPrice: 14, pharmeasyPrice: 15, apolloLink: 'https://www.apollopharmacy.in/medicine/okacet-10mg-tablet?doNotTrack=true', netmedsLink: 'https://www.netmeds.com/product/okacet-tablet-10s-lui77q-8339060', pharmeasyLink: 'https://www.1mg.com/drugs/cetrizine-tablet-54921' },
    { name: 'Azithromycin', img: '', apolloPrice: 60, netmedsPrice: 58, pharmeasyPrice: 59, apolloLink: 'https://www.apollopharmacy.in/medicine/azax-500mg-tablet?doNotTrack=true', netmedsLink: 'https://www.netmeds.com/product/azithral-500mg-tablet-5s-lui4bl-8282180', pharmeasyLink: 'https://www.1mg.com/drugs/azithral-500-tablet-325616' },
    { name: 'Metformin', img: '', apolloPrice: 25, netmedsPrice: 24, pharmeasyPrice: 23, apolloLink: 'https://www.apollopharmacy.in/medicine/okamet-500mg-tablet?doNotTrack=true', netmedsLink: 'https://www.netmeds.com/product/janumet-50500mg-tablet-15s-lui1v7-8229523', pharmeasyLink: 'https://www.1mg.com/drugs/glycomet-500-sr-tablet-117725' },
    { name: 'Amlodipine', img: '', apolloPrice: 22, netmedsPrice: 21, pharmeasyPrice: 20, apolloLink: 'https://www.apollopharmacy.in/search-medicines?source=/medicine/okamet-500mg-tablet', netmedsLink: 'https://www.netmeds.com/product/telma-am-40mg-tablet-15s-lui7x4-8352243', pharmeasyLink: 'https://www.1mg.com/drugs/amlip-5-tablet-43925' },
    { name: 'Atorvastatin', img: '', apolloPrice: 35, netmedsPrice: 34, pharmeasyPrice: 33, apolloLink: 'https://www.apollopharmacy.in/medicine/atrastin-10-tablet-10-s?doNotTrack=true', netmedsLink: 'https://www.netmeds.com/product/ecosprin-av-75mg-capsule-15s-lui2by-8240272', pharmeasyLink: 'https://www.1mg.com/drugs/lipvas-10-tablet-74062' },
    { name: 'Losartan', img: '', apolloPrice: 28, netmedsPrice: 27, pharmeasyPrice: 26, apolloLink: 'https://www.apollopharmacy.in/medicine/losartas-50mg-tablet?doNotTrack=true', netmedsLink: 'https://www.netmeds.com/product/losar-50mg-tablet-15s-lui3vq-8272212', pharmeasyLink: 'https://www.1mg.com/drugs/losar-50-tablet-74731' },
    { name: 'Omeprazole', img: '', apolloPrice: 18, netmedsPrice: 17, pharmeasyPrice: 16, apolloLink: 'https://www.apollopharmacy.in/medicine/aquris-omzole-capsule-15-s?doNotTrack=true', netmedsLink: 'https://www.netmeds.com/product/omez-20mg-capsule-20s-lui7z2-8353180', pharmeasyLink: 'https://www.1mg.com/drugs/omee-capsule-349946' },
    { name: 'Pantoprazole', img: '', apolloPrice: 19, netmedsPrice: 18, pharmeasyPrice: 17, apolloLink: 'https://www.apollopharmacy.in/search-medicines?source=/medicine/aquris-omzole-capsule-15-s', netmedsLink: 'https://www.netmeds.com/product/pan-40mg-tablet-15s-lui278-8237698', pharmeasyLink: 'https://www.1mg.com/drugs/pan-40-tablet-325250' },
    { name: 'Levothyroxine', img: '', apolloPrice: 40, netmedsPrice: 39, pharmeasyPrice: 38, apolloLink: 'https://www.apollopharmacy.in/search-medicines/Levothyroxine', netmedsLink: 'https://www.netmeds.com/product/euthyrox-25mcg-tablet-100s-lui6yt-8334430', pharmeasyLink: 'https://www.1mg.com/drugs/euthyrox-25-tablet-962105' },
    { name: 'Salbutamol', img: '', apolloPrice: 32, netmedsPrice: 31, pharmeasyPrice: 30, apolloLink: 'https://www.apollopharmacy.in/medicine/salbutamol-4mg-tablet?doNotTrack=true', netmedsLink: 'https://www.netmeds.com/product/asthalin-inhaler-200md-lui25w-8236682', pharmeasyLink: 'https://www.1mg.com/drugs/asthalin-100mcg-inhaler-141944' },
    { name: 'Montelukast', img: '', apolloPrice: 27, netmedsPrice: 26, pharmeasyPrice: 25, apolloLink: 'https://www.apollopharmacy.in/medicine/telekast-10mg-tablet?doNotTrack=true', netmedsLink: 'https://www.netmeds.com/product/montina-l-tablet-10s-lufur4-7521582', pharmeasyLink: 'https://www.1mg.com/drugs/montu-10mg-tablet-323213' },
    { name: 'Doxycycline', img: '', apolloPrice: 45, netmedsPrice: 44, pharmeasyPrice: 43, apolloLink: 'https://www.apollopharmacy.in/medicine/minicycline-100mg-tablet?doNotTrack=true', netmedsLink: 'https://www.netmeds.com/product/doxy-1-l-dr-forte-capsule-10s-lui2x9-8252480', pharmeasyLink: 'https://www.1mg.com/drugs/minicycline-capsule-126001' },
    { name: 'Ranitidine', img: '', apolloPrice: 16, netmedsPrice: 15, pharmeasyPrice: 14, apolloLink: 'https://www.apollopharmacy.in/medicine/minicycline-100mg-tablet?doNotTrack=true', netmedsLink: 'https://www.netmeds.com/product/rantac-150mg-tablet-30s-lufuds-7523423', pharmeasyLink: 'https://www.1mg.com/drugs/retiva-tablet-739658' },
    { name: 'Ciprofloxacin', img: '', apolloPrice: 55, netmedsPrice: 54, pharmeasyPrice: 53, apolloLink: 'https://www.apollopharmacy.in/medicine/ciplox-500mg-tablet?doNotTrack=true', netmedsLink: 'https://www.netmeds.com/product/ciplox-500mg-tablet-10s-lufuqf-7523402', pharmeasyLink: 'https://www.1mg.com/drugs/ciprodac-500-tablet-56644' },
  ]);
  console.log('Medicines seeded');
}
// seedMedicines();

// API endpoint to get all medicines
app.get('/api/medicines', async (req, res) => {
  const meds = await Medicine.find();
  res.json(meds);
});

// API endpoint to list collaborator doctors
app.get('/api/doctors', async (req, res) => {
  const docs = await Doctor.find().sort({ name: 1 });
  res.json(docs);
});

// Create an appointment for a collaborator doctor
app.post('/api/appointments', async (req, res) => {
  try {
    const { patientName, email, doctorId, date, symptoms } = req.body;
    if (!patientName || !doctorId || !date) {
      return res.status(400).json({ error: 'patientName, doctorId and date are required' });
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    const appt = new Appointment({
      patientName,
      email,
      doctor: doctor._id,
      date: new Date(date),
      symptoms
    });
    await appt.save();

    // TODO: notify provider (email/SMS) - integrate later

    res.json({ success: true, appointment: appt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.get('/api/hello', (req, res) => {
//   res.json({ message: 'Hello from Express backend!' });
// });

app.listen(PORT, () => {
  console.log(`Express backend running on port ${PORT}`);
});
