import React, { useState } from "react";
import { useAdminUsers, useUpdateUserRole } from "@/helpers/useAdminData";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRoleArrayValues } from "@/helpers/schema";
import styles from "./admin.users.module.css";

export default function AdminUsersPage() {
    const { data: usersData, isLoading } = useAdminUsers();
    const updateRoleMutation = useUpdateUserRole();

    const handleRoleChange = (userId, newRole) => {
        updateRoleMutation.mutate({ userId, role: newRole });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manage Users</h1>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={4}><Skeleton className={styles.rowSkeleton} /></td>
                                </tr>
                            ))
                        ) : usersData?.users?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className={styles.emptyState}>No users found</td>
                            </tr>
                        ) : (
                            usersData?.users?.map((user) => (
                                <tr key={user.id}>
                                    <td className={styles.userCell}>
                                        <Avatar className={styles.avatar}>
                                            <AvatarImage src={user.avatarUrl || undefined} />
                                            <AvatarFallback>
                                                {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        {user.displayName}
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <Select
                                            value={user.role}
                                            onValueChange={(val) => handleRoleChange(user.id, val)}
                                            disabled={updateRoleMutation.isPending}
                                        >
                                            <SelectTrigger className={styles.roleSelect}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {UserRoleArrayValues.map(role => (
                                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
