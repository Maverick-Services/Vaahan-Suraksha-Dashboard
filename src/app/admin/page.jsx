'use client';
import React from 'react';
import PageHeading from '@/components/shared/PageHeading';
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout';
import BuildIcon from '@mui/icons-material/Build'; import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'; import Inventory2Icon from '@mui/icons-material/Inventory2'; import PeopleIcon from '@mui/icons-material/People'; import BusinessIcon from '@mui/icons-material/Business'; import TwoWheelerIcon from '@mui/icons-material/TwoWheeler'; import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function AdminHome() {
    const demo = {
        serviceOrders: 128,
        salesAug2025: '₹ 1,24,560',
        servicesCount: 24,
        productsCount: 142,
        customers: 1024,
        companies: 68,
        riders: 39,
        employees: 17,
        admins: 3,
    };

    const StatCard = ({ title, value, Icon, color }) => (
        <div className="bg-white rounded-lg border border-gray-200 px-5 py-8 flex justify-between items-center hover:border-gray-300 duration-200 ease-in-out transition">
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
            <div className={`w-14 h-14 flex items-center justify-center rounded-full`} style={{ backgroundColor: color }}>
                <Icon sx={{ fontSize: 28, color: '#fff' }} />
            </div>
        </div>
    );

    return (
        <InnerDashboardLayout>
            <PageHeading>Vaahan Suraksha Admin Panel</PageHeading>

            {/* 4 cards in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 w-full">
                <StatCard title="Service Orders" value={demo.serviceOrders} Icon={BuildIcon} color="#0EA5A4" />
                <StatCard title="Sales (Aug 2025)" value={demo.salesAug2025} Icon={MonetizationOnIcon} color="#EF4444" />
                <StatCard title="Services" value={demo.servicesCount} Icon={MiscellaneousServicesIcon} color="#06B6D4" />
                <StatCard title="Products" value={demo.productsCount} Icon={Inventory2Icon} color="#F59E0B" />
            </div>

            {/* Users Overview - full width next row */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 mt-4  w-full">
                <h3 className="text-lg font-bold mb-4">Users Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <UserChip count={demo.customers} label="Customers" color="#4F46E5" Icon={PeopleIcon} />
                    <UserChip count={demo.companies} label="Companies" color="#7C3AED" Icon={BusinessIcon} />
                    <UserChip count={demo.riders} label="Riders" color="#059669" Icon={TwoWheelerIcon} />
                    <UserChip count={demo.employees} label="Employees" color="#2563EB" Icon={PersonIcon} />
                    <UserChip count={demo.admins} label="Admins" color="#0F172A" Icon={AdminPanelSettingsIcon} />
                </div>
            </div>
        </InnerDashboardLayout>
    );
}

const UserChip = ({ count, label, color, Icon }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
        <div className="w-10 h-10 flex items-center justify-center rounded-full" style={{ backgroundColor: color }}>
            <Icon sx={{ fontSize: 20, color: '#fff' }} />
        </div>
        <div>
            <p className="text-xl font-bold">{count}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);
