"use client";
import React, { useState, useMemo, useEffect } from "react";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import OneTimePlansTable from "./components/OtpTable";
import OtpDialog from "./components/OtpDialog";
import { useOneTimePlans } from "@/hooks/useOneTimePlans";
import { Button, Box, TextField, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

export default function OneTimePlansPage() {
    const { oneTimePlansQuery } = useOneTimePlans();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // simple search input (debounce)
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        const t = setTimeout(() => setSearchQuery(searchInput.trim()), 700);
        return () => clearTimeout(t);
    }, [searchInput]);

    const queryParams = useMemo(
        () => ({
            page,
            limit,
            ...(searchQuery ? { searchQuery } : {}),
        }),
        [page, limit, searchQuery]
    );

    const plansData = oneTimePlansQuery(queryParams);

    if (plansData.isError) {
        return <div>Error: {plansData.error?.message || "Failed to load One Time Plans"}</div>;
    }

    const apiData = plansData?.data?.data?.data || {
        plans: [],
        pagination: { page: 1, limit },
        totalCount: 0,
    };

    const handleReset = () => {
        setSearchInput("");
        setSearchQuery("");
        setPage(1);
        plansData.refetch && plansData.refetch();
    };

    return (
        <InnerDashboardLayout>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-3xl mt-1">One-time Plans</h2>
                    <p className="text-gray-500 text-base">Manage one-time plans — create, edit and view plans.</p>
                </div>

                <div className="flex gap-3">
                    <Tooltip title="Refresh" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                onClick={() => plansData.refetch && plansData.refetch()}
                                aria-label="Refresh"
                                disabled={!!plansData.isRefetching}
                            >
                                <RefreshIcon />
                            </Button>
                        </span>
                    </Tooltip>

                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        sx={{ textTransform: "capitalize" }}
                        onClick={() => { setEditingItem(null); setDialogOpen(true); }}
                    >
                        Add Plan
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="mb-4">
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ position: 'absolute', left: 12, pointerEvents: 'none', color: '#9CA3AF' }}>
                        <SearchIcon />
                    </Box>
                    <TextField
                        variant="outlined"
                        placeholder="Search plans..."
                        size="small"
                        fullWidth
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        InputProps={{ style: { paddingLeft: 44 } }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "7px", minHeight: 40 } }}
                    />
                </Box>
            </div>

            <div className="bg-white p-6 border border-gray-300 rounded-xl">
                <OneTimePlansTable
                    apiData={{
                        plans: apiData?.plans || apiData?.data || [],
                        pagination: apiData?.pagination || { page, limit },
                        totalCount: apiData?.totalCount || 0,
                    }}
                    onPageChange={(p) => setPage(p)}
                    limit={limit}
                    setLimit={setLimit}
                    dataLoading={plansData.isLoading}
                    onEdit={(row) => { setEditingItem(row); setDialogOpen(true); }}
                />
            </div>

            <OtpDialog
                open={dialogOpen}
                initialData={editingItem}
                onClose={() => { setDialogOpen(false); setEditingItem(null); }}
            />
        </InnerDashboardLayout>
    );
}
