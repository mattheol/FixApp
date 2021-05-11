export const subcategories = [
  { label: 'Instalacje elektryczne', value: 1, category: 1, key: 1 },
  { label: 'Pogotowie elektryczne', value: 2, category: 1, key: 2 },
  { label: 'Pomiary elektryczne', value: 3, category: 1, key: 3 },
  { label: 'Instalacja wodna', value: 4, category: 2, key: 4 },
  { label: 'Pogotowie hydrauliczne', value: 5, category: 2, key: 5 },
  { label: 'Montaż kabiny prysznicowej', value: 6, category: 2, key: 6 },
  { label: 'Malowanie ścian', value: 7, category: 3, key: 7 },
  { label: 'Tapetowanie', value: 8, category: 3, key: 8 },
];

export const categories = [
  { label: 'Elektryk', value: 1, key: 1 },
  { label: 'Hydraulik', value: 2, key: 2 },
  { label: 'Malarz', value: 3, key: 3 },
];

export interface Order {
  orderDocId?: string;
  clientId: string;
  city: string;
  address: string;
  description: string;
  startTime: number;
  subcategoryId: number;
}

export interface User {
  userDocId?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  type: 0 | 1; //0 = klient, 1 = wykonawca
}
