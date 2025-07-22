import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Pharmacy {
    id: number;
    name: string;
    city: string;
    latitude: string;
    longitude: string;
    license_number: string;
    number_sells: number;
    number_buys: number;
}

interface Owner {
    id: number;
    email: string;
    phone: string;
    created_at: string;
    numberOfpharmacies: number;
}

interface DashboardState {
    owner: Owner | null;
    pharmacies: Pharmacy[];
    searchTerm: string;
}

const initialState: DashboardState = {
    owner: {
        id: 1,
        email: "admin@example.com",
        phone: "+201234567890",
        created_at: "2023-01-01",
        numberOfpharmacies: 5
    },
    pharmacies: [
        {
            id: 1,
            name: "Light Pharmacy",
            city: "Cairo",
            latitude: "30.0444",
            longitude: "31.2357",
            license_number: "PH123456",
            number_sells: 1245,
            number_buys: 843
        },
        {
            id: 2,
            name: "Healing Pharmacy",
            city: "Giza",
            latitude: "29.9870",
            longitude: "31.2118",
            license_number: "PH654321",
            number_sells: 987,
            number_buys: 621
        },
        {
            id: 3,
            name: "Hope Pharmacy",
            city: "Alexandria",
            latitude: "31.2001",
            longitude: "29.9187",
            license_number: "PH789012",
            number_sells: 1562,
            number_buys: 932
        },
        {
            id: 4,
            name: "Life Pharmacy",
            city: "Cairo",
            latitude: "30.0626",
            longitude: "31.2497",
            license_number: "PH345678",
            number_sells: 843,
            number_buys: 512
        },
        {
            id: 5,
            name: "Mercy Pharmacy",
            city: "Mansoura",
            latitude: "31.0409",
            longitude: "31.3785",
            license_number: "PH901234",
            number_sells: 721,
            number_buys: 498
        }
    ],
    searchTerm: "",
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setOwner(state, action: PayloadAction<Owner>) {
            state.owner = action.payload;
        },
        setPharmacies(state, action: PayloadAction<Pharmacy[]>) {
            state.pharmacies = action.payload;
        },
       
        setSearchTerm(state, action: PayloadAction<string>) {
            state.searchTerm = action.payload;
        },
    },
});

export const { setOwner, setPharmacies, setSearchTerm } = dashboardSlice.actions;
export default dashboardSlice.reducer; 