"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin/auth";

export default function ProfilePage() {
    const { isAuthed, user, logout } = useAdminAuth();
    const u: any = user ?? {};
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleLogout = async () => {
        await logout?.();
        router.push("/");
    };

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-surface pt-28 pb-16">
            <div className="container-edit max-w-xl">
                <h1 className="font-display font-bold text-3xl mb-8">My Profile</h1>

                {!isAuthed ? (
                    <div className="bg-card border line-rule rounded-2xl p-8 text-center">
                        <p className="font-body text-sm text-muted mb-4">
                            Please sign in to see your profile.
                        </p>
                        <Link
                            href="/login" // ⚠️ adjust to your login route
                            className="inline-block px-6 py-3 rounded-full bg-[#02d683] text-ink font-display font-bold text-sm"
                        >
                            Sign in
                        </Link>
                    </div>
                ) : (
                    <div className="bg-card border line-rule rounded-2xl p-6 space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-[#02d683]/15 text-[#02d683] flex items-center justify-center font-display font-bold text-xl">
                                {(u.name || u.email || "?").charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="font-display font-bold text-lg truncate">
                                    {u.name || "My Account"}
                                </p>
                                {u.email && (
                                    <p className="font-body text-sm text-muted truncate">{u.email}</p>
                                )}
                            </div>
                        </div>

                        <dl className="font-body text-sm divide-y line-rule border-t border-b line-rule">
                            {u.role && (
                                <div className="flex justify-between py-3">
                                    <dt className="text-muted">Account type</dt>
                                    <dd className="capitalize">{u.role}</dd>
                                </div>
                            )}
                            {u.createdAt && (
                                <div className="flex justify-between py-3">
                                    <dt className="text-muted">Member since</dt>
                                    <dd>{new Date(u.createdAt).toLocaleDateString()}</dd>
                                </div>
                            )}
                        </dl>

                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href="/inquiries"
                                className="flex items-center justify-center py-3 rounded-full bg-[#02d683] text-ink font-display font-bold text-sm hover:bg-[#02bc73] transition-colors"
                            >
                                My Inquiries
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="py-3 rounded-full border line-rule font-display font-bold text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}