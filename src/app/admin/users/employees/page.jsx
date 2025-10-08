"use client";
import React, { useState, useEffect } from "react";
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { useUsers } from "@/hooks/useUsers";
import EmployeesTable from "./components/EmployeesTable";
import {
  Button, Box, TextField, FormControl, InputLabel, Select, MenuItem, Tooltip
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddEmployeeDialog from "./components/EmployeeDialog";

export default function EmployeesPage() {
  const demo = {
    totalEmployees: 1024,
    newThisMonth: 17,
    active: 900,
    pending: 12,
  };

  const { usersQuery } = useUsers();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Search: immediate input + debounced searchQuery (3s to match Customers)
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Status filter state
  const [status, setStatus] = useState("");

  // Debounce effect: update searchQuery 3s after user stops typing
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearchQuery(searchInput.trim());
    }, 3000);

    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  const queryParams = {
    role: "employee",
    page,
    limit,
    ...(searchQuery ? { searchQuery } : {}),
    ...(status ? { status } : {}),
  };

  const usersData = usersQuery(queryParams);

  if (usersData.isError) {
    return <div>Error: {usersData.error?.message || "Failed to load employees"}</div>;
  }

  // safe default so prerender/build won't crash
  const apiData = usersData?.data?.data?.data || {
    users: [],
    pagination: { page: 1, limit },
    totalCount: 0,
  };

  const StatCard = ({ title, value, Icon, color }) => (
    <div className="bg-white border border-gray-300 rounded-xl px-5 py-8 flex justify-between items-center hover:border-gray-300 duration-200 ease-in-out transition">
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
      <div className="w-14 h-14 flex items-center justify-center rounded-full" style={{ backgroundColor: color }}>
        <Icon sx={{ fontSize: 28, color: "#fff" }} />
      </div>
    </div>
  );

  // Reset filters handler
  const handleResetFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setStatus("");
    setPage(1);
    if (usersData?.refetch) usersData.refetch();
  };

  return (
    <InnerDashboardLayout>
      {/* Header */}
      <div className="mb-0 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-3xl mt-1">Employees</h2>
          <p className="text-gray-500 text-base">Manage all employees — add new employees, view joining dates and contact info.</p>
        </div>

        <div className="flex gap-3">
          <Tooltip title="Refresh" arrow>
            <span>
              <LoadingButton
                variant="outlined"
                onClick={() => usersData.refetch()}
                loading={usersData.isRefetching || usersData.isFetching}
                aria-label="Refresh"
              >
                <RefreshIcon />
              </LoadingButton>
            </span>
          </Tooltip>

          <Tooltip title="Download" arrow>
            <span>
              <Button variant="outlined" onClick={() => { /* TODO download */ }} aria-label="Download">
                <ArrowDownwardIcon />
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Add employee" arrow>
            <span>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{ textTransform: "capitalize" }}
                onClick={() => { setEditingItem(null); setDialogOpen(true); }}
                aria-label="Add Employee"
              >
                Add Employee
              </Button>
            </span>
          </Tooltip>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 w-full mb-6">
        <StatCard title="Employees" value={apiData?.totalCount ?? demo.totalEmployees} Icon={PeopleIcon} color="#111827" />
        <StatCard title="Active" value={demo.active} Icon={PersonIcon} color="#059669" />
        <StatCard title="New This Month" value={demo.newThisMonth} Icon={PersonIcon} color="#0ea5e9" />
        <StatCard title="Pending" value={demo.pending} Icon={PersonIcon} color="#f59e0b" />
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 border border-gray-300 rounded-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-2xl">Employee Directory</h2>
            <p className="text-gray-500 text-sm">Search and manage employees, export data or add new employees.</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <Box className="flex-1" sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ position: 'absolute', left: 12, pointerEvents: 'none', color: '#9CA3AF' }}>
              <SearchIcon />
            </Box>

            <TextField
              variant="outlined"
              placeholder="Search employees, name, id..."
              size="small"
              fullWidth
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              slotProps={{
                input: {
                  style: { paddingLeft: 44 },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "7px", minHeight: 40 }
              }}
            />
          </Box>

          <Box sx={{ minWidth: 180 }}>
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "7px" } }}
            >
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Tooltip title="Reset filters" arrow>
            <span>
              <Button variant="outlined" onClick={handleResetFilters} aria-label="Reset Filters">
                <RestartAltIcon />
              </Button>
            </span>
          </Tooltip>
        </div>

        <EmployeesTable
          apiData={apiData}
          onPageChange={(newPage) => setPage(newPage)}
          limit={limit}
          setLimit={setLimit}
          dataLoading={usersData.isLoading}
          onEdit={(e) => { setEditingItem(e); setDialogOpen(true); }}
        />
      </div>

      <AddEmployeeDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingItem(null); }}
        initialData={editingItem}
      />
    </InnerDashboardLayout>
  );
}
