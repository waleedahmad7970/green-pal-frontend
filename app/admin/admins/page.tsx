"use client";

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

export default function AdminAdminsPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

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

    const admins = users?.filter((u) => u.role === "admin");

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
                title="Admins"
                description="People who can manage this dashboard."
                action={<PrimaryButton onClick={() => setModalOpen(true)}>Add admin</PrimaryButton>}
            />

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            {loading ? (
                <p className="text-sand/40 font-body text-sm">Loading…</p>
            ) : (
                <>
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        <StatCard label="Admins" value={String(admins.length)} />
                        <StatCard label="All users" value={String(users.length)} />
                    </div>

                    <div className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-x-auto">
                        <table className="w-full text-sm font-body">
                            <thead>
                                <tr className="text-left text-sand/40 border-b border-sand/10">
                                    <th className="p-4 font-normal">Name</th>
                                    <th className="p-4 font-normal">Email</th>
                                    <th className="p-4 font-normal">Role</th>
                                    <th className="p-4 font-normal">Added</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((u) => {
                                    const d = parseISO(u.createdAt);
                                    return (
                                        <tr key={u._id} className="border-b border-sand/5 last:border-0">
                                            <td className="p-4 text-sand">{u.name}</td>
                                            <td className="p-4 text-sand/70">{u.email}</td>
                                            <td className="p-4">
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full text-amber-400 bg-amber-400/10">
                                                    {u?.role}
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
                        {admins.length === 0 && (
                            <p className="p-6 text-center text-sand/40 text-sm">No admins found.</p>
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