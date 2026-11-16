// Curated raga corpus (M4). Semitones are relative to Sa (0). Sargam mapping by semitone:
// 0 Sa, 1 Re♭, 2 Re, 3 Ga♭, 4 Ga, 5 Ma, 6 Ma#, 7 Pa, 8 Dha♭, 9 Dha, 10 Ni♭, 11 Ni.

export interface Raga {
  id: string;
  name: string;
  thaat: string;
  aroha: number[];     // ascending semitones incl. Sa at 0 and octave at 12
  avaroha: number[];   // descending
  vadi: number;
  samvadi: number;
  pakad: number[][];   // characteristic phrases
  time: string;
  rasa: string;
  ornaments: string[];
  notes: string;
}

export const RAGAS: Raga[] = [
  { id: 'yaman', name: 'Yaman', thaat: 'Kalyan',
    aroha: [0,2,4,6,7,9,11,12], avaroha: [12,11,9,7,6,4,2,0],
    vadi: 4, samvadi: 11,
    pakad: [[11,2,4,6,7,9,11],[4,6,7,9,11,9,7,6,4]],
    time: 'Evening (first prahar)', rasa: 'Shringara (romance)',
    ornaments: ['meend (glide)', 'andolan on Ga'],
    notes: 'Teerivra Ma (6). No komal notes. Evokes devotion and romance.' },
  { id: 'bhairav', name: 'Bhairav', thaat: 'Bhairav',
    aroha: [0,1,4,5,7,8,11,12], avaroha: [12,11,8,7,5,4,1,0],
    vadi: 8, samvadi: 1,
    pakad: [[0,1,4,5,7,8,7,5,4,1,0],[4,5,7,8,11,8,7,5,4]],
    time: 'Early morning', rasa: 'Bhakti (devotion), gravity',
    ornaments: ['andolan on Re and Dha', 'meend'],
    notes: 'Komal Re (1) and Dha (8). Serious, devotional mood.' },
  { id: 'bhoopali', name: 'Bhoopali', thaat: 'Kalyan',
    aroha: [0,4,7,9,12], avaroha: [12,9,7,4,0],
    vadi: 4, samvadi: 9,
    pakad: [[0,4,7,9,7,4,0],[4,7,9,12,9,7,4]],
    time: 'Evening', rasa: 'Shanta (peace)',
    ornaments: ['meend'],
    notes: 'Pentatonic. Omits Ma and Ni. Light, peaceful.' },
  { id: 'malkauns', name: 'Malkauns', thaat: 'Bhairavi',
    aroha: [0,3,5,8,10,12], avaroha: [12,10,8,5,3,0],
    vadi: 5, samvadi: 0,
    pakad: [[0,3,5,8,10,8,5,3,0],[5,8,10,8,5,3,0]],
    time: 'Late night', rasa: 'Veer (heroic), gambhir',
    ornaments: ['meend', 'gamak'],
    notes: 'Pentatonic with komal Ga, Dha, Ni. Deep, meditative.' },
  { id: 'darbari', name: 'Darbari Kanada', thaat: 'Asavari',
    aroha: [0,2,3,5,7,8,10,12], avaroha: [12,10,8,7,5,3,2,0],
    vadi: 2, samvadi: 7,
    pakad: [[0,2,3,5,7,5,3,2,0],[2,3,5,7,8,10,8,7,5,3,2]],
    time: 'Late night', rasa: 'Gambhir (serious), karuna',
    ornaments: ['andolan on Ga and Dha', 'meend'],
    notes: 'Komal Ga (3), Dha (8), Ni (10). Gravity and pathos.' },
  { id: 'todi', name: 'Todi', thaat: 'Todi',
    aroha: [0,1,3,6,8,11,12], avaroha: [12,11,8,6,3,1,0],
    vadi: 8, samvadi: 3,
    pakad: [[0,1,3,6,8,6,3,1,0],[3,6,8,11,8,6,3]],
    time: 'Morning', rasa: 'Karuna (pathos)',
    ornaments: ['andolan on Re, Ga, Dha', 'meend'],
    notes: 'Komal Re (1), Ga (3), Dha (8); tivra Ma (6). Intense, searching.' },
  { id: 'marwa', name: 'Marwa', thaat: 'Marwa',
    aroha: [0,1,4,6,7,9,11,12], avaroha: [12,11,9,7,6,4,1,0],
    vadi: 1, samvadi: 9,
    pakad: [[0,1,4,6,7,9,11,9,7,6,4,1,0],[4,6,7,9,11,9,7,6,4]],
    time: 'Sunset', rasa: 'Veer (heroic), sandhi-prakash',
    ornaments: ['meend'],
    notes: 'Komal Re (1), tivra Ma (6). Evokes transition, urgency.' },
  { id: 'puriya', name: 'Puriya', thaat: 'Marwa',
    aroha: [0,1,4,6,9,11,12], avaroha: [12,11,9,6,4,1,0],
    vadi: 4, samvadi: 9,
    pakad: [[0,1,4,6,9,11,9,6,4,1,0],[4,6,9,11,9,6,4]],
    time: 'Evening', rasa: 'Shringara',
    ornaments: ['meend'],
    notes: 'Hexatonic. Omits Pa. Romantic, serious.' },
  { id: 'khamaj', name: 'Khamaj', thaat: 'Khamaj',
    aroha: [0,2,4,5,7,9,10,12], avaroha: [12,10,9,7,5,4,2,0],
    vadi: 4, samvadi: 10,
    pakad: [[0,2,4,5,7,9,10,9,7,5,4,2,0],[4,5,7,9,10,9,7,5,4]],
    time: 'Late night', rasa: 'Shringara (light)',
    ornaments: ['meend'],
    notes: 'Komal Ni (10). Light, romantic, folk-flavoured.' },
  { id: 'kafi', name: 'Kafi', thaat: 'Kafi',
    aroha: [0,2,3,5,7,9,10,12], avaroha: [12,10,9,7,5,3,2,0],
    vadi: 7, samvadi: 0,
    pakad: [[0,2,3,5,7,5,3,2,0],[3,5,7,9,10,9,7,5,3]],
    time: 'Late night', rasa: 'Shringara',
    ornaments: ['meend', 'gamak'],
    notes: 'Komal Ga (3), Ni (10). Basis of many thumris.' },
  { id: 'durga', name: 'Durga', thaat: 'Bilawal',
    aroha: [0,2,5,7,9,12], avaroha: [12,9,7,5,2,0],
    vadi: 5, samvadi: 0,
    pakad: [[0,2,5,7,9,7,5,2,0],[2,5,7,9,7,5,2]],
    time: 'Evening', rasa: 'Veer (heroic)',
    ornaments: ['meend'],
    notes: 'Pentatonic, no Ga/Dha komal. Bright, heroic.' },
  { id: 'desh', name: 'Desh', thaat: 'Khamaj',
    aroha: [0,2,5,7,9,11,12], avaroha: [12,11,9,7,5,2,0],
    vadi: 2, samvadi: 7,
    pakad: [[0,2,5,7,9,11,9,7,5,2,0],[5,7,9,11,9,7,5]],
    time: 'Late night', rasa: 'Shringara',
    ornaments: ['meend'],
    notes: 'Pentatonic aroha with Ni shuddh. Light, patriotic.' },
];
