export const API_BASE_URL = 'http://localhost:5000/';

export const SYMPTOMS = [
    { id: 1, name: 'Fever', icon: '🌡️' },
    { id: 2, name: 'Cough', icon: '🤧' },
    { id: 3, name: 'Headache', icon: '🤕' },
    { id: 4, name: 'Fatigue', icon: '😴' },
    { id: 5, name: 'Nausea', icon: '🤢' },
    { id: 6, name: 'Sore Throat', icon: '😷' },
    { id: 7, name: 'Body Pain', icon: '💪' },
    { id: 8, name: 'Dizziness', icon: '😵' },
    { id: 9, name: 'Shortness of Breath', icon: '🫁' },
    { id: 10, name: 'Chest Pain', icon: '❤️' },
    { id: 11, name: 'Stomach Pain', icon: '🤰' },
    { id: 12, name: 'Skin Rash', icon: '👩‍🦰' }
];

export const EMERGENCY_CONTACTS = [
    {
        id: 1,
        name: 'Emergency Medical Services',
        number: '911',
        type: 'Emergency',
        icon: 'fa-ambulance'
    },
    {
        id: 2,
        name: 'Poison Control Center',
        number: '1-800-222-1222',
        type: 'Hotline',
        icon: 'fa-phone-alt'
    },
    {
        id: 3,
        name: 'Mental Health Crisis',
        number: '988',
        type: 'Crisis',
        icon: 'fa-head-side-virus'
    },
    {
        id: 4,
        name: 'Local Hospital',
        number: '(555) 123-4567',
        type: 'Hospital',
        icon: 'fa-hospital'
    },
    {
        id: 5,
        name: 'Personal Doctor',
        number: '(555) 987-6543',
        type: 'Doctor',
        icon: 'fa-user-md'
    },
    {
        id: 6,
        name: 'Emergency Contact',
        number: '(555) 555-5555',
        type: 'Personal',
        icon: 'fa-user-friends'
    }
];