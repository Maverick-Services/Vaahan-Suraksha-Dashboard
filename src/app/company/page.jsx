"use client";
import React from "react";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import PageHeading from "@/components/shared/PageHeading";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Button } from "@mui/material";

export default function page() {
    const { user } = useAuthStore();
    const router = useRouter();

    if (!user) {
        return (
            <InnerDashboardLayout>
                <PageHeading>Company Dashboard</PageHeading>
                <div className="py-10 text-center text-gray-500">Loading company...</div>
            </InnerDashboardLayout>
        );
    }

    const createdAt = formatDate(user.createdAt);
    const updatedAt = formatDate(user.updatedAt);
    const membersCount = Array.isArray(user.members) ? user.members.length : 0;

    function formatDate(dateString) {
        if (!dateString) return "-";
        try {
            const d = new Date(dateString);
            return d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        } catch {
            return dateString;
        }
    }

    return (
        <InnerDashboardLayout>
            <PageHeading>Company Dashboard</PageHeading>

            <div className="mt-6 w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left: Company Main Card (spans 2 cols on large screens) */}
                <div className="lg:col-span-2 border border-gray-200 rounded-lg bg-white p-6">
                    <div className="flex items-start gap-2">

                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                        <BusinessIcon fontSize="small" /> Company
                                        <span className="mx-2">•</span>
                                        <span className="font-medium text-gray-700">{user.user_id}</span>
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Active badge */}
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200">
                                        {user.active ? (
                                            <>
                                                <CheckCircleOutlineIcon fontSize="small" sx={{ color: "#16A34A" }} />
                                                <span className="text-sm font-medium text-gray-700">Active</span>
                                            </>
                                        ) : (
                                            <>
                                                <CancelOutlinedIcon fontSize="small" sx={{ color: "#DC2626" }} />
                                                <span className="text-sm font-medium text-gray-700">Inactive</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Subscription badge */}
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200">
                                        <SubscriptionsIcon fontSize="small" sx={{ color: user.isSubscribed ? "#0EA5A4" : "#6B7280" }} />
                                        <span className="text-sm font-medium text-gray-700">
                                            {user.isSubscribed ? "Subscribed" : "Not Subscribed"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact + meta */}
                            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-3 border border-gray-100 rounded-md px-4 py-3">
                                    <PhoneIcon fontSize="small" sx={{ color: "#2563EB" }} />
                                    <div>
                                        <div className="text-gray-800 font-medium">{user.phoneNo || "-"}</div>
                                        <div className="text-xs text-gray-500">Phone</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 border border-gray-100 rounded-md px-4 py-3">
                                    <EmailIcon fontSize="small" sx={{ color: "#7C3AED" }} />
                                    <div>
                                        <div className="text-gray-800 font-medium">{user.email || "-"}</div>
                                        <div className="text-xs text-gray-500">Email</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 border border-gray-100 rounded-md px-4 py-3">
                                    <GroupIcon fontSize="small" sx={{ color: "#4F46E5" }} />
                                    <div>
                                        <div className="text-gray-800 font-medium">{membersCount}</div>
                                        <div className="text-xs text-gray-500">Members</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 border border-gray-100 rounded-md px-4 py-3">
                                    <CalendarTodayIcon fontSize="small" sx={{ color: "#059669" }} />
                                    <div>
                                        <div className="text-gray-800 font-medium">{createdAt}</div>
                                        <div className="text-xs text-gray-500">Joined</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-end gap-3">
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    sx={{ textTransform: "none" }}
                                    color="secondary"
                                >
                                    Edit Details
                                </Button>

                                <Button
                                    variant="contained"
                                    onClick={() => router.push("/company/members")}
                                    startIcon={<GroupIcon />}
                                    sx={{ textTransform: "none" }}
                                >
                                    View Members
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-xs text-gray-500">
                        <div>Last updated: {updatedAt}</div>
                        <div className="mt-1">Role: <span className="font-medium text-gray-700">{user.role}</span></div>
                        <div className="mt-1">DB id: <span className="text-gray-400 text-xs">{user._id}</span></div>
                    </div>
                </div>

                {/* Right: Quick Stats / Actions */}
                <div className="border border-gray-200 rounded-lg bg-white p-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-4">Quick Overview</h4>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between border border-gray-100 rounded-md px-4 py-3">
                            <div className="flex items-center gap-3">
                                <GroupIcon sx={{ color: "#4F46E5" }} />
                                <div>
                                    <div className="text-sm font-medium text-gray-800">{membersCount}</div>
                                    <div className="text-xs text-gray-500">Members</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">Manage</div>
                        </div>

                        <div className="flex items-center justify-between border border-gray-100 rounded-md px-4 py-3">
                            <div className="flex items-center gap-3">
                                <SubscriptionsIcon sx={{ color: "#0EA5A4" }} />
                                <div>
                                    <div className="text-sm font-medium text-gray-800">{user.isSubscribed ? "Active" : "None"}</div>
                                    <div className="text-xs text-gray-500">Subscription</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">{user.isSubscribed ? "Renew" : "Upgrade"}</div>
                        </div>

                        <div className="flex items-center justify-between border border-gray-100 rounded-md px-4 py-3">
                            <div className="flex items-center gap-3">
                                <CalendarTodayIcon sx={{ color: "#059669" }} />
                                <div>
                                    <div className="text-sm font-medium text-gray-800">{createdAt}</div>
                                    <div className="text-xs text-gray-500">Joined</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">—</div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button
                            variant="outlined"
                            sx={{ textTransform: "none" }}
                            fullWidth
                            onClick={() => router.push("/company/mySubscriptions")}
                        >
                            Manage Subscription
                        </Button>
                    </div>
                </div>
            </div>
        </InnerDashboardLayout>
    );
}
