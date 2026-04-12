export interface Contact {
  id: string;
  name: string;
  phone: string;
  type: 'sos' | 'medical';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  missed?: boolean;
}

export interface EmergencyNumber {
  name: string;
  number: string;
  description: string;
  color: 'red' | 'green';
}

export type Tab = 'sos' | 'medical' | 'contacts' | 'map' | 'help';
export type MedicalSubTab = 'meds' | 'scanner' | 'ai';
