import { initializeDatabase, saveDatabase } from '../src/config/database';
import path from 'path';
import dotenv from 'dotenv';

// Load env from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function seed(): Promise<void> {
  const DB_PATH = process.env.DATABASE_PATH || './data/database.sqlite';
  const resolvedPath = path.resolve(process.cwd(), DB_PATH);

  console.log(`🌱 Seeding database at: ${resolvedPath}`);

  const db = await initializeDatabase(resolvedPath);

  // Clear existing data
  db.run('DELETE FROM services');

  const seedData = [
    // Ambulances (8)
    {
      title: 'QuickResponse Emergency Medical Services',
      description: 'Premier 24/7 emergency ambulance service with state-of-the-art cardiac monitoring equipment and certified paramedics serving the urban core.',
      location: '142 Commerce Plaza, Central District',
      type: 'ambulance',
      image_url: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800',
    },
    {
      title: 'Premier Critical Care Transport',
      description: 'Specialized high-acuity patient transport with advanced life support technicians and mobile ICU capabilities for inter-hospital transfers.',
      location: '567 Innovation Drive, Tech Park',
      type: 'ambulance',
      image_url: 'https://images.unsplash.com/photo-1619468129361-605ebea04b44?w=800',
    },
    {
      title: 'Regional Community Ambulance',
      description: 'Comprehensive emergency medical services for suburban regions featuring BLS and ALS units with mutual aid coordination network.',
      location: '234 Rural Route 5, Countryside',
      type: 'ambulance',
      image_url: null,
    },
    {
      title: 'Coastal Rescue Medical Services',
      description: 'Specialized coastal and maritime emergency response with amphibious rescue capabilities and aquatic medicine training.',
      location: '890 Seaport Avenue, Marina District',
      type: 'ambulance',
      image_url: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a41?w=800',
    },
    {
      title: 'Enterprise Medical Transport',
      description: 'Professional non-emergency medical transport and scheduled transfers with wheelchair-accessible fleet and patient care coordinators.',
      location: '345 Commerce Road, Industrial Zone',
      type: 'ambulance',
      image_url: null,
    },
    {
      title: 'LifeGuard Ambulance Network',
      description: 'Community-based ambulance service with comprehensive emergency response, standby service, and community health education programs.',
      location: '456 Community Boulevard, Riverside',
      type: 'ambulance',
      image_url: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800',
    },
    {
      title: 'Aero Medical Response',
      description: 'Advanced air ambulance service featuring helicopter and fixed-wing aircraft for critical care transport and long-distance medical evacuations.',
      location: 'Aviation Terminal Helipad, City Airport',
      type: 'ambulance',
      image_url: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4?w=800',
    },
    {
      title: 'Wellness Medical Transport Solutions',
      description: 'Compassionate emergency and routine transport services with specialized training in geriatric care and accessibility assistance.',
      location: '678 Comfort Lane, North Edge',
      type: 'ambulance',
      image_url: null,
    },
    // Doctors (10)
    {
      title: 'Dr. Marcus Johnson — Emergency & Trauma',
      description: 'Highly experienced emergency medicine physician with extensive trauma center expertise and 18 years of critical care specialization.',
      location: 'St. Michael Medical Complex, 200 Healthcare Boulevard',
      type: 'doctor',
      image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800',
    },
    {
      title: 'Dr. Victoria Chen — Interventional Cardiologist',
      description: 'Board-certified interventional cardiologist with expertise in coronary interventions, heart failure management, and acute coronary syndromes.',
      location: 'Premier Cardiac Institute, 415 Heart Valley Drive',
      type: 'doctor',
      image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800',
    },
    {
      title: 'Dr. Hassan Al-Rashid — General Surgery',
      description: 'Skilled surgical specialist with expertise in emergency surgical interventions, trauma surgery, and acute abdomen management.',
      location: 'Central Surgical Center, 550 Surgical Plaza',
      type: 'doctor',
      image_url: null,
    },
    {
      title: 'Dr. Alexandra Martinez — Family Medicine',
      description: 'Compassionate primary care physician specializing in urgent care, preventive medicine, and managing complex medical conditions for families.',
      location: 'Community Health Partners, 310 Wellness Drive',
      type: 'doctor',
      image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800',
    },
    {
      title: 'Dr. Kwame Osei — Pediatric Critical Care',
      description: 'Dedicated pediatric emergency medicine physician with 14 years of experience in acute pediatric care and emergency management.',
      location: "Bright Star Children's Hospital, 620 Rainbow Boulevard",
      type: 'doctor',
      image_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800',
    },
    {
      title: 'Dr. Sofia Bergström — Orthopedic Emergency',
      description: 'Specialist in emergency orthopedic care, complex fracture management, and sports medicine injuries with surgical capabilities.',
      location: 'Advanced Orthopedic Trauma Center, 480 Mobility Lane',
      type: 'doctor',
      image_url: null,
    },
    {
      title: 'Dr. Rajesh Kumar — Neurology & Stroke',
      description: 'Neurology expert specializing in acute stroke intervention, neurological emergencies, and comprehensive neurological assessment.',
      location: 'Neuroscience Excellence Institute, 360 Brain Health Way',
      type: 'doctor',
      image_url: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=800',
    },
    {
      title: 'Dr. Catherine Flynn — Anesthesiology',
      description: 'Senior anesthesiologist with critical care expertise, emergency anesthesia protocols, and perioperative risk management specialization.',
      location: 'St. Michael Medical Complex, 200 Healthcare Boulevard',
      type: 'doctor',
      image_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800',
    },
    {
      title: 'Dr. Amara Okafor — Internal Medicine',
      description: 'Hospital medicine physician experienced in acute care management, complex medical emergencies, and critical disease processes.',
      location: 'Metro District Medical Center, 275 Internal Medicine Plaza',
      type: 'doctor',
      image_url: null,
    },
    {
      title: 'Dr. Andreas Müller — Pulmonary & Critical Care',
      description: 'Pulmonology specialist with intensive care unit expertise in respiratory failure, mechanical ventilation, and critical illness management.',
      location: 'Respiratory Health Specialists, 530 Pulmonary Drive',
      type: 'doctor',
      image_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800',
    },
  ];

  const insertSql = `INSERT INTO services (title, description, location, type, image_url) VALUES (?, ?, ?, ?, ?)`;

  for (const record of seedData) {
    db.run(insertSql, [
      record.title,
      record.description,
      record.location,
      record.type,
      record.image_url,
    ]);
  }

  // Persist to disk
  saveDatabase(db, resolvedPath);

  // Verify
  const countResult = db.exec('SELECT COUNT(*) as count FROM services');
  const count = countResult[0]?.values[0]?.[0] ?? 0;

  const typeResults = db.exec('SELECT type, COUNT(*) as count FROM services GROUP BY type');
  console.log(`✅ Seeded ${count} records:`);
  if (typeResults[0]) {
    for (const row of typeResults[0].values) {
      console.log(`   - ${row[0]}: ${row[1]}`);
    }
  }

  db.close();
  console.log('🌱 Seed complete!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
