"use client";

import { useTableSort, SortTh, type SortAccessors } from "@/components/admin/sort";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { format, parseISO, isValid } from "date-fns";
import {
    PageHeader, PrimaryButton, AdminModal, FormField, inputClass, StatCard,
} from "@/components/admin/ui";
import { AdminUser, createAdmin, fetchUsers } from "@/lib/admin/services/users";

const AdminSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "At least 6 characters").required("Required"),
});

const userSort: SortAccessors<AdminUser> = {
    name: (u) => u.name,
    email: (u) => u.email,
    role: (u) => u.role,
    added: (u) => new Date(u.createdAt).getTime(),
};

export default function AdminAdminsPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");

    const load = async () => {
        try {
            setUsers(await fetchUsers());
        } catch (e: any) {
            setError(e?.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const admins = users?.filter((u) => u.role === "admin") ?? [];
    const visible = roleFilter === "all" ? users : users.filter((u) => u.role === roleFilter);
    const { sorted: sortedUsers, sort, toggle } = useTableSort(visible, userSort);

    const handleCreate = async (values: any, { resetForm, setStatus }: any) => {
        try {
            await createAdmin(values);
            setModalOpen(false);
            resetForm();
            load();
        } catch (e: any) {
            setStatus(e?.response?.data?.message || e?.message || "Failed to create admin");
        }
    };

    return (
        <div>
            <PageHeader
                title="Users"
                description="Everyone with an account: admins who manage this dashboard and customers."
                action={
                    <div className="flex gap-3">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as "all" | "admin" | "user")}
                            className="bg-transparent text-sm font-body border border-sand/15 rounded-lg px-3 py-2 outline-none cursor-pointer text-sand"
                        >
                            <option value="all" className="bg-ink">All users</option>
                            <option value="admin" className="bg-ink">Admins</option>
                            <option value="user" className="bg-ink">Customers</option>
                        </select>
                        <PrimaryButton onClick={() => setModalOpen(true)}>Add admin</PrimaryButton>
                    </div>
                }
            />

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            {loading ? (
                <p className="text-sand/40 font-body text-sm">Loading…</p>
            ) : (
                <>
                    <div className="grid sm:grid-cols-3 gap-4 mb-8">
                        <StatCard label="All users" value={String(users.length)} />
                        <StatCard label="Customers" value={String(users.length - admins.length)} />
                        <StatCard label="Admins" value={String(admins.length)} />
                    </div>

                    <div className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-x-auto">
                        <table className="w-full text-sm font-body">
                            <thead>
                                <tr className="text-left text-sand/40 border-b border-sand/10">
                                    <SortTh label="Name" sortKey="name" sort={sort} onSort={toggle} />
                                    <SortTh label="Email" sortKey="email" sort={sort} onSort={toggle} />
                                    <SortTh label="Role" sortKey="role" sort={sort} onSort={toggle} />
                                    <SortTh label="Added" sortKey="added" sort={sort} onSort={toggle} />
                                </tr>
                            </thead>
                            <tbody>
                                {sortedUsers.map((u) => {
                                    const d = parseISO(u.createdAt);
                                    return (
                                        <tr key={u._id} className="border-b border-sand/5 last:border-0">
                                            <td className="p-4 text-sand">{u.name}</td>
                                            <td className="p-4 text-sand/70">{u.email}</td>
                                            <td className="p-4">
                                                <span
                                                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                                        u.role === "admin"
                                                            ? "text-amber-400 bg-amber-400/10"
                                                            : "text-sky-300 bg-sky-400/10"
                                                    }`}
                                                >
                                                    {u.role === "admin" ? "admin" : "customer"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sand/50 text-xs">
                                                {isValid(d) ? format(d, "dd MMM yyyy") : "—"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {visible.length === 0 && (
                            <p className="p-6 text-center text-sand/40 text-sm">No users found.</p>
                        )}
                    </div>
                </>
            )}

            <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add admin">
                <Formik
                    initialValues={{ name: "", email: "", password: "" }}
                    validationSchema={AdminSchema}
                    onSubmit={handleCreate}
                >
                    {({ isSubmitting, status }) => (
                        <Form>
                            <FormField label="Name">
                                <Field name="name" className={inputClass} />
                                <ErrorMessage name="name" component="div" className="text-red-400 text-xs mt-1" />
                            </FormField>
                            <FormField label="Email">
                                <Field name="email" type="email" className={inputClass} />
                                <ErrorMessage name="email" component="div" className="text-red-400 text-xs mt-1" />
                            </FormField>
                            <FormField label="Password">
                                <Field name="password" type="password" className={inputClass} />
                                <ErrorMessage name="password" component="div" className="text-red-400 text-xs mt-1" />
                            </FormField>
                            {status && <p className="text-red-400 text-sm mb-3">{status}</p>}
                            <PrimaryButton type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create admin"}
                            </PrimaryButton>
                        </Form>
                    )}
                </Formik>
            </AdminModal>
        </div>
    );
}