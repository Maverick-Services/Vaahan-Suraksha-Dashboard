import React, { useState } from "react"
import Sidebar from "../../components/dashboard/Sidebar"
import Navbar from "../../components/dashboard/Navbar"

function LayoutDashboard({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev)
    }
    return (
        <div className="flex h-screen">
            {/* Temporary (mobile) sidebar */}
            <Sidebar
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
            />

            {/* Permanent (desktop) sidebar */}
            <div className="max-[900px]:hidden ">
                <Sidebar variant="permanent" />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Navbar */}
                <Navbar onDrawerToggle={handleDrawerToggle} />

                {/* Page content, pushed below the AppBar (default 64px height) */}
                <main className="flex-1 max-[900px]:pt-[64px] p-2 max-[900px]:p-4 overflow-y-auto bg-[#F9FAFB]">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default LayoutDashboard