"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogIn, FiChevronLeft, FiChevronRight, FiUser, FiSettings, FiBarChart2, FiAward, FiBell, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { SparklesIcon } from "@heroicons/react/24/outline";

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

import {
  BriefcaseIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";

import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm } from '../store/dashboardSlice';
import type { RootState } from '../store/store';

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

interface DashboardData {
  owner: Owner;
  pharmacies: Pharmacy[];
}

const mockDashboardData: DashboardData = {
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
    },
    {
      id: 6,
      name: "Sunshine Pharmacy",
      city: "Luxor",
      latitude: "25.6872",
      longitude: "32.6396",
      license_number: "PH567890",
      number_sells: 1100,
      number_buys: 750
    },
    {
      id: 7,
      name: "Green Pharmacy",
      city: "Aswan",
      latitude: "24.0889",
      longitude: "32.8998",
      license_number: "PH678901",
      number_sells: 920,
      number_buys: 680
    },
    {
      id: 8,
      name: "Blue Pharmacy",
      city: "Alexandria",
      latitude: "31.2005",
      longitude: "29.9189",
      license_number: "PH789123",
      number_sells: 1350,
      number_buys: 890
    },
    {
      id: 9,
      name: "Red Pharmacy",
      city: "Giza",
      latitude: "29.9875",
      longitude: "31.2120",
      license_number: "PH891234",
      number_sells: 1050,
      number_buys: 720
    },
    {
      id: 10,
      name: "Gold Pharmacy",
      city: "Cairo",
      latitude: "30.0448",
      longitude: "31.2360",
      license_number: "PH912345",
      number_sells: 1500,
      number_buys: 950
    }
  ]
};

function getAdminInitials(email: string) {
  if (!email) return '';
  const [name] = email.split('@');
  return name.slice(0, 2).toUpperCase();
}

function Dashboard() {
  const dashboardData = useSelector((state: RootState) => state.dashboard);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'pharmacies' | 'statistics' | 'news' | 'achievements' | 'settings'>('overview');
  const dispatch = useDispatch();
  const searchTerm = useSelector((state: RootState) => state.dashboard.searchTerm);
  const pharmacies = useSelector((state: RootState) => state.dashboard.pharmacies);
  const router = useRouter();

  const [avatar, setAvatar] = useState<string>(typeof window !== 'undefined' ? localStorage.getItem('userAvatar') || '' : '');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [userEmail, setUserEmail] = useState<string>(
    typeof window !== 'undefined'
      ? localStorage.getItem('authEmail') || dashboardData.owner?.email || ''
      : dashboardData.owner?.email || ''
  );
  const [userInitials, setUserInitials] = useState<string>('');

  // Sorting and pagination state
  const [sortConfig, setSortConfig] = useState<{ key: keyof Pharmacy; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Update mock data with additional pharmacies if needed
  useEffect(() => {
    if (dashboardData.pharmacies.length < 10) {
      dispatch({ type: 'dashboard/setPharmacies', payload: mockDashboardData.pharmacies });
    }
  }, [dashboardData.pharmacies.length, dispatch]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('authEmail') || dashboardData.owner?.email || '';
      setUserEmail(email);
      setUserInitials(getAdminInitials(email));
    }
  }, [dashboardData.owner]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          localStorage.setItem('userAvatar', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleLogout = () => {
    localStorage.removeItem('authEmail');
    router.push('/home');
  };

  // Sorting function
  const requestSort = (key: keyof Pharmacy) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Get sorted items
  const getSortedItems = () => {
    if (!sortConfig) return pharmacies;

    return [...pharmacies].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter and sort pharmacies
  const filteredPharmacies = getSortedItems().filter(pharmacy =>
    !searchTerm ||
    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPharmacies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPharmacies.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getSortIndicator = (key: keyof Pharmacy) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />;
  };

  if (!dashboardData || !dashboardData.owner) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">No data available</div>
      </div>
    );
  }

  return (
    <div>
      {dashboardData && (
        <div className="fixed top-2 right-2 sm:top-4 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <div
            onClick={() => router.push('/home')}
            className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full bg-white flex items-center justify-center text-indigo-700 font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl shadow-md border-2 border-indigo-400 animate-pulse cursor-pointer"
          >
            {userInitials}
          </div>
          <button
            onClick={() => router.push('/home')}
            className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl shadow-md border-2 border-indigo-400 hover:bg-indigo-700 transition-colors"
            title="Pharmacy Login"
          >
            <FiLogIn />
          </button>
        </div>
      )}

      <div className={`mx-auto flex min-h-screen w-full min-w-[320px] flex-col bg-white ${sidebarCollapsed ? 'lg:ps-20' : 'lg:ps-64'}`}>
        <nav
          className={`fixed start-0 top-0 bottom-0 z-50 flex h-full ${sidebarCollapsed ? 'w-20' : 'w-80'} flex-col overflow-auto bg-gradient-to-b from-indigo-700 to-indigo-900 transition-all duration-500 ease-out lg:${sidebarCollapsed ? 'w-20' : 'w-64'} lg:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          aria-label="Main Sidebar Navigation"
        >
          {!sidebarCollapsed && (
            <div className="w-full flex-none h-20 flex items-center justify-between px-2 transition-all duration-300">
              <div className="flex items-center gap-3 w-full">
                <div className="relative group cursor-pointer" onClick={handleAvatarClick} title=" change">
                  {avatar ? (
                    <img src={avatar} alt="User Avatar" className="h-12 w-12 rounded-full border-2 border-indigo-300 shadow object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-indigo-300 flex items-center justify-center text-white text-2xl">
                      <FiUser />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                  <span className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">change</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base truncate">{userEmail.split('@')[0]}</span>
                  <span className="text-indigo-200 text-xs truncate">{userEmail}</span>
                </div>
              </div>
              <button
                className="text-indigo-200 hover:text-white transition-all ml-auto"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <FiChevronRight size={22} /> : <FiChevronLeft size={22} />}
              </button>
            </div>
          )}

          {sidebarCollapsed && (
            <div className="w-full flex-none h-12 flex items-center justify-center px-0 transition-all duration-300">
              <button
                className="text-indigo-200 hover:text-white transition-all"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <FiChevronRight size={22} /> : <FiChevronLeft size={22} />}
              </button>
            </div>
          )}

          <div className="w-full grow space-y-2 p-2 flex flex-col">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-semibold shadow-xs transition-all ${activeTab === 'overview' ? 'bg-white text-indigo-700 shadow-indigo-200' : 'bg-indigo-800 text-indigo-100 hover:bg-indigo-700'} ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <FiUser className="text-indigo-400" size={20} />
              {!sidebarCollapsed && <span className="text-sm">Dashboard</span>}
            </button>
            <button
              onClick={() => setActiveTab('pharmacies')}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-semibold shadow-xs transition-all ${activeTab === 'pharmacies' ? 'bg-white text-indigo-700 shadow-indigo-200' : 'bg-indigo-800 text-indigo-100 hover:bg-indigo-700'} ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <svg className="bi bi-briefcase-fill text-indigo-400" width={20} height={20} fill="currentColor" viewBox="0 0 16 16"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5z" /><path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85v5.65z" /></svg>
              {!sidebarCollapsed && <span className="text-sm">Pharmacies</span>}
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-semibold shadow-xs transition-all ${activeTab === 'statistics' ? 'bg-white text-indigo-700 shadow-indigo-200' : 'bg-indigo-800 text-indigo-100 hover:bg-indigo-700'} ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <FiBarChart2 className="text-indigo-400" size={20} />
              {!sidebarCollapsed && <span className="text-sm">Statistics</span>}
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-semibold shadow-xs transition-all ${activeTab === 'news' ? 'bg-white text-indigo-700 shadow-indigo-200' : 'bg-indigo-800 text-indigo-100 hover:bg-indigo-700'} ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <FiBell className="text-indigo-400 animate-bounce" size={20} />
              {!sidebarCollapsed && <span className="text-sm">News</span>}
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-semibold shadow-xs transition-all ${activeTab === 'achievements' ? 'bg-white text-indigo-700 shadow-indigo-200' : 'bg-indigo-800 text-indigo-100 hover:bg-indigo-700'} ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <FiAward className="text-indigo-400 animate-pulse" size={20} />
              {!sidebarCollapsed && <span className="text-sm">Achievements</span>}
            </button>
          </div>

          <div className="w-full flex-none space-y-2 p-2 mt-auto flex flex-col">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-semibold shadow-xs transition-all ${activeTab === 'settings' ? 'bg-white text-indigo-700 shadow-indigo-200' : 'bg-indigo-800 text-indigo-100 hover:bg-indigo-700'} ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <FiSettings className="text-indigo-400 animate-spin-slow" size={20} />
              {!sidebarCollapsed && <span className="text-sm">Settings</span>}
            </button>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-semibold text-indigo-100 hover:bg-indigo-800 hover:text-white transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <svg className="bi bi-lock-fill inline-block size-4 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /></svg>
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </nav>

        <header className="fixed start-0 end-0 top-0 z-30 flex h-20 flex-none items-center bg-white shadow-xs lg:hidden">
          <div className="container mx-auto flex justify-between px-4 lg:px-8 xl:max-w-7xl">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-indigo-200 bg-white px-2 py-1.5 font-semibold leading-6 text-indigo-800 shadow-xs hover:border-indigo-300 hover:bg-indigo-100 hover:text-indigo-800 hover:shadow-sm focus:outline-hidden focus:ring-3 focus:ring-indigo-500/25 active:border-white active:bg-white active:shadow-none"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <svg
                  className="hi-solid hi-menu-alt-1 inline-block size-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-lg font-bold tracking-wide text-indigo-900 transition hover:opacity-75 active:opacity-100"
              >
                <img
                  src="https://raw.githubusercontent.com/Youssif-Hamdy/logo/refs/heads/main/logo.png"
                  alt="Logo"
                  className="h-10 w-10 mr-2"
                />
                <span>Smart<span className="font-medium text-indigo-600">PharmaNet</span></span>
              </a>
            </div>

            <div className="flex items-center gap-2">

            </div>
          </div>
        </header>

        <main className="flex max-w-full flex-auto flex-col pt-20 lg:pt-0 bg-gradient-to-br from-indigo-50 to-white">
          <div className="container mx-auto space-y-10 px-4 py-8 lg:space-y-16 lg:px-8 lg:py-12 xl:max-w-7xl">
            {activeTab === 'overview' && (
              <div className="space-y-6 p-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Overview</h2>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                    Welcome {userEmail}, everything looks great!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Pharmacies</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                          {dashboardData.owner.numberOfpharmacies}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                        <BriefcaseIcon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Growth Rate</span>
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">+8.2%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{ width: '82%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Increase this month</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Total Sells</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                          {dashboardData.pharmacies.reduce((total, pharmacy) => total + pharmacy.number_sells, 0)}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                        <ShoppingCartIcon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Sales Target</span>
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">72%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-2 rounded-full"
                          style={{ width: '72%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Quarterly target achieved</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Total Buys</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                          {dashboardData.pharmacies.reduce((total, pharmacy) => total + pharmacy.number_buys, 0)}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                        <ShoppingBagIcon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Buys Target</span>
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">61%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-400 to-indigo-300 h-2 rounded-full"
                          style={{ width: '61%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Quarterly target achieved</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <ChartBarIcon className="h-5 w-5 text-indigo-500" />
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">Avg Sales per Pharmacy</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {dashboardData.pharmacies.length > 0 ?
                        Math.round(dashboardData.pharmacies.reduce((total, p) => total + p.number_sells, 0) / dashboardData.pharmacies.length) :
                        0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Average across all pharmacies</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPinIcon className="h-5 w-5 text-indigo-500" />
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">Top City</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {(() => {
                        const cityCount: Record<string, number> = {};
                        dashboardData.pharmacies.forEach(p => { cityCount[p.city] = (cityCount[p.city] || 0) + 1; });
                        const top = Object.entries(cityCount).sort((a, b) => b[1] - a[1])[0];
                        return top ? `${top[0]} (${top[1]})` : 'N/A';
                      })()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Most pharmacies location</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <ChartBarIcon className="h-5 w-5 text-indigo-500" />
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">Weekly Sales Trend</h3>
                    </div>
                    <div className="h-[120px]">
                      <Line
                        data={{
                          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                          datasets: [{
                            label: 'Sales',
                            data: [1200, 1900, 1500, 2000, 1800, 2500, 2200],
                            backgroundColor: 'rgba(99, 102, 241, 0.6)',
                            borderColor: 'rgba(99, 102, 241, 1)',
                            borderWidth: 1,
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: { enabled: true }
                          },
                          scales: {
                            x: {
                              grid: { display: false },
                              ticks: { color: '#6b7280' }
                            },
                            y: {
                              grid: { color: 'rgba(0,0,0,0.05)' },
                              ticks: { color: '#6b7280' }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-5 shadow-sm mt-6">
                  <div className="flex items-center gap-3">
                    <SparklesIcon className="h-5 w-5 text-white" />
                    <h3 className="font-medium text-white">Keep growing!</h3>
                  </div>
                  <p className="text-white font-medium mt-2">Your network is expanding rapidly 🚀</p>
                  <p className="text-indigo-100 text-xs mt-1">Stay tuned for more features and analytics!</p>
                </div>
              </div>
            )}

            {activeTab === 'pharmacies' && (
              <div>
                <h2 className="mb-2 text-3xl font-semibold text-indigo-900 flex items-center gap-2">
                  <svg className="bi bi-briefcase-fill inline-block size-6 text-indigo-400 animate-bounce" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5z" /><path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85v5.65z" /></svg>
                  List of pharmacies
                </h2>
                <h3 className="mb-8 text-sm font-medium text-indigo-500">
                  You have <span className="font-semibold">{dashboardData.pharmacies.length} pharmacies</span> registered
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="rounded-xl bg-white shadow p-4 flex flex-col gap-1 border border-indigo-50">
                    <span className="text-xs text-indigo-400">Most Cities</span>
                    <span className="font-bold text-indigo-700 text-lg">
                      {(() => {
                        const cityCount: Record<string, number> = {};
                        dashboardData.pharmacies.forEach(p => { cityCount[p.city] = (cityCount[p.city] || 0) + 1; });
                        const top = Object.entries(cityCount).sort((a, b) => b[1] - a[1])[0];
                        return top ? `${top[0]} (${top[1]})` : 'N/A';
                      })()}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white shadow p-4 flex flex-col gap-1 border border-indigo-50">
                    <span className="text-xs text-indigo-400">Average Sales per Pharmacy</span>
                    <span className="font-bold text-indigo-700 text-lg">
                      {dashboardData.pharmacies.length > 0 ? Math.round(dashboardData.pharmacies.reduce((total, p) => total + p.number_sells, 0) / dashboardData.pharmacies.length) : 0}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white shadow p-4 flex flex-col gap-1 border border-indigo-50">
                    <span className="text-xs text-indigo-400">Highest Sales</span>
                    <span className="font-bold text-indigo-700 text-lg">
                      {(() => {
                        const top = dashboardData.pharmacies.reduce((prev, curr) => curr.number_sells > prev.number_sells ? curr : prev, dashboardData.pharmacies[0]);
                        return top ? `${top.name} (${top.number_sells})` : 'N/A';
                      })()}
                    </span>
                  </div>
                </div>
                <div className="mb-6 flex justify-between items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search pharmacies..."
                    className="w-full max-w-xs px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-indigo-700 bg-indigo-50"
                    value={searchTerm}
                    onChange={e => dispatch(setSearchTerm(e.target.value))}
                  />
                  <span className="text-xs text-indigo-400 ml-2">Tip: Search by name or city</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {dashboardData.pharmacies
                    .filter(pharmacy =>
                      !searchTerm ||
                      pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      pharmacy.city.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((pharmacy, idx, arr) => {
                      const topSeller = arr.reduce((prev, curr) => curr.number_sells > prev.number_sells ? curr : prev, arr[0]);
                      return (
                        <div key={pharmacy.id} className="rounded-2xl border border-indigo-100 bg-white shadow-md p-6 flex flex-col gap-3 hover:shadow-lg transition-all relative">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold shadow">
                              <svg className="bi bi-capsule-pill inline-block size-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M7.646 11.854a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0z" /><path d="M6.354 4.146a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708l3.5-3.5a.5.5 0 0 1 .708 0z" /><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2z" /></svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-indigo-900 text-lg flex items-center gap-2">
                                {pharmacy.name}
                                {pharmacy.id === topSeller.id && (
                                  <span className="ml-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-300 text-white text-xs font-bold animate-pulse">Top Seller</span>
                                )}
                              </h4>
                              <h5 className="text-xs text-indigo-400">{pharmacy.city}</h5>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-indigo-700">
                            <span className="bg-indigo-50 px-2 py-1 rounded-full">License: {pharmacy.license_number}</span>
                            <span className="bg-green-50 px-2 py-1 rounded-full">Sells: {pharmacy.number_sells}</span>
                            <span className="bg-purple-50 px-2 py-1 rounded-full">Buys: {pharmacy.number_buys}</span>
                            <span className="bg-yellow-50 px-2 py-1 rounded-full">Location: {pharmacy.latitude}, {pharmacy.longitude}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="mt-8 text-center text-indigo-400 text-sm">Keep up the good work! Your pharmacy network is growing and thriving 🚀</div>
              </div>
            )}

            {activeTab === 'statistics' && (
              <div className="space-y-8 p-4">
                <div className="flex items-center gap-3">
                  <FiBarChart2 className="text-indigo-500" size={28} />
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Performance Statistics</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                    <div className="text-indigo-600 dark:text-indigo-400 font-medium">Network Growth</div>
                    <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">+12.5%</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs last month</div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                    <div className="text-indigo-600 dark:text-indigo-400 font-medium">Active Users</div>
                    <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">1,240</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">connected this week</div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                    <div className="text-indigo-600 dark:text-indigo-400 font-medium">Avg Response Time</div>
                    <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">2.1s</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">chat support</div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 col-span-1 md:col-span-2 lg:col-span-1">
                    <div className="text-center text-gray-700 dark:text-gray-300 font-medium mb-3">Sales Trend</div>
                    <div className="w-full h-[160px]">
                      <Line
                        data={{
                          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                          datasets: [{
                            label: 'Sales',
                            data: [500, 700, 900, 1200, 1500, 1700, 1600, 1800, 2000, 2100, 2200, 2300],
                            borderColor: '#6366f1',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            tension: 0.3,
                            borderWidth: 2
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: {
                            x: { grid: { display: false } },
                            y: { grid: { color: 'rgba(0,0,0,0.05)' } }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                  <div className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Monthly Sales Trend</div>
                  <div className="h-[300px]">
                    <Line
                      data={{
                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                        datasets: [
                          {
                            label: 'Total Sales',
                            data: [500, 700, 900, 1200, 1500, 1700, 1600, 1800, 2000, 2100, 2200, 2300],
                            borderColor: '#6366f1',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            tension: 0.3,
                            borderWidth: 2
                          },
                          {
                            label: 'Total Purchases',
                            data: [400, 600, 800, 1000, 1200, 1300, 1250, 1400, 1500, 1600, 1700, 1800],
                            borderColor: '#8b5cf6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            tension: 0.3,
                            borderWidth: 2
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' },
                          tooltip: { mode: 'index', intersect: false }
                        },
                        scales: {
                          x: { grid: { display: false } },
                          y: { grid: { color: 'rgba(0,0,0,0.05)' } }
                        },
                        interaction: { mode: 'nearest', axis: 'x', intersect: false }
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">(Live data example)</div>
                </div>
              </div>
            )}

            {activeTab === 'news' && (
              <div>
                <h2 className="mb-2 text-3xl font-semibold text-indigo-900 flex items-center gap-2">
                  <FiBell className="text-indigo-400 animate-bounce" size={28} />
                  News and Updates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  <div className="rounded-2xl bg-white shadow p-6 flex flex-col gap-2 border border-indigo-50 animate-fade-in">
                    <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80" alt="news1" className="rounded-lg h-32 w-full object-cover mb-2" />
                    <span className="font-bold text-indigo-800">New Pharmacy Branch Opened</span>
                    <span className="text-xs text-indigo-400">April 2024</span>
                    <span className="text-indigo-600 text-sm">New branch added to the network in Cairo.</span>
                  </div>
                  <div className="rounded-2xl bg-white shadow p-6 flex flex-col gap-2 border border-indigo-50 animate-fade-in">
                    <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="news2" className="rounded-lg h-32 w-full object-cover mb-2" />
                    <span className="font-bold text-indigo-800">System Update Released</span>
                    <span className="text-xs text-indigo-400">March 2024</span>
                    <span className="text-indigo-600 text-sm">Dashboard now supports real-time analytics and notifications.</span>
                  </div>
                  <div className="rounded-2xl bg-white shadow p-6 flex flex-col gap-2 border border-indigo-50 animate-fade-in">
                    <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="news3" className="rounded-lg h-32 w-full object-cover mb-2" />
                    <span className="font-bold text-indigo-800">Excellence Award</span>
                    <span className="text-xs text-indigo-400">February 2024</span>
                    <span className="text-indigo-600 text-sm">SmartPharmaNet won the "Best Digital Healthcare Network" award.</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div>
                <h2 className="mb-2 text-3xl font-semibold text-indigo-900 flex items-center gap-2">
                  <FiAward className="text-indigo-400 animate-pulse" size={28} />
                  Achievements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  <div className="rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-200 shadow p-6 flex flex-col gap-2 border border-yellow-100 animate-fade-in">
                    <span className="text-white font-bold text-lg flex items-center gap-2"><FiAward /> Top Seller</span>
                    <span className="text-2xl font-bold text-white">Pharmacy Cairo</span>
                    <span className="text-xs text-yellow-100">Highest sales in March 2024</span>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-200 shadow p-6 flex flex-col gap-2 border border-indigo-100 animate-fade-in">
                    <span className="text-white font-bold text-lg flex items-center gap-2"><FiUser /> Best Owner</span>
                    <span className="text-2xl font-bold text-white">{userEmail.split('@')[0]}</span>
                    <span className="text-xs text-indigo-100">Most active owner this quarter</span>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-green-400 to-green-200 shadow p-6 flex flex-col gap-2 border border-green-100 animate-fade-in">
                    <span className="text-white font-bold text-lg flex items-center gap-2"><FiBarChart2 /> Fastest Growth</span>
                    <span className="text-2xl font-bold text-white">+25%</span>
                    <span className="text-xs text-green-100">Network growth in 2024</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
                <div className="flex flex-col items-center mb-2">
                  <span className="bg-indigo-100 rounded-full p-4 mb-2 flex items-center justify-center">
                    <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm7.94-2.34a1 1 0 0 0 .26-1.09l-1-1.73a1 1 0 0 1 .21-1.19l1.52-1.52a1 1 0 0 0 0-1.41l-2.12-2.12a1 1 0 0 0-1.41 0l-1.52 1.52a1 1 0 0 1-1.19.21l-1.73-1a1 1 0 0 0-1.09.26l-1.06 1.06a1 1 0 0 0-.26 1.09l1 1.73a1 1 0 0 1-.21 1.19l-1.52 1.52a1 1 0 0 0 0 1.41l2.12 2.12a1 1 0 0 0 1.41 0l1.52-1.52a1 1 0 0 1 1.19-.21l1.73 1a1 1 0 0 0 1.09-.26l1.06-1.06z" /></svg>
                  </span>
                  <h2 className="text-xl font-bold text-indigo-800">Settings and Tips</h2>
                </div>
                <div className="w-full max-w-md flex flex-col gap-4">
                  <div className="bg-white border border-indigo-100 rounded-lg p-4 flex items-center gap-3">
                    <span className="bg-indigo-50 text-indigo-500 rounded-full p-2 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                    </span>
                    <span className="text-indigo-700 text-sm">Stay informed about the latest features and improvements of the dashboard.</span>
                  </div>

                  <div className="bg-white border border-indigo-100 rounded-lg p-4 flex items-center gap-3">
                    <span className="bg-indigo-50 text-indigo-500 rounded-full p-2 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                    </span>
                    <span className="text-indigo-700 text-sm">Regularly review your pharmacy data for accuracy and reliability.</span>
                  </div>

                  <div className="bg-white border border-indigo-100 rounded-lg p-4 flex items-center gap-3">
                    <span className="bg-indigo-50 text-indigo-500 rounded-full p-2 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span className="text-indigo-700 text-sm">Use analytics to track sales performance and make better decisions.</span>
                  </div>
                  <div className="bg-white border border-indigo-100 rounded-lg p-4 flex items-center gap-3">
                    <span className="bg-indigo-50 text-indigo-500 rounded-full p-2 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15 8.6a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 15z" /></svg>
                    </span>
                    <span className="text-indigo-700 text-sm">Explore new features as they become available to enhance your workflow.</span>
                  </div>
                  <div className="bg-white border border-indigo-100 rounded-lg p-4 flex items-center gap-3">
                    <span className="bg-indigo-50 text-indigo-500 rounded-full p-2 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 0 0-10 0v2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2zm-5 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg>
                    </span>
                    <span className="text-indigo-700 text-sm">Keep your account secure by logging out after completing your work.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        \
        <footer className="flex grow-0 items-center border-t border-slate-100">
          <div className="container mx-auto flex flex-col gap-2 px-4 py-6 text-center text-sm font-medium text-slate-600 md:flex-row md:justify-between md:gap-0 md:text-start lg:px-8 xl:max-w-7xl">
            <div>© <span className="font-semibold">SmartPharma</span></div>
            <div className="inline-flex items-center justify-center">
              <span>Created for</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="mx-1 size-4 text-red-600"
              >
                <path
                  d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z"
                ></path>
              </svg>
              <span>Smart Pharma Net</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;