"use client"

import { useState } from 'react'
import { useUserStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Shield, Key, Smartphone, Mail, AlertTriangle, Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function SecurityPage() {
    const { user } = useUserStore()
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle password change logic here
        setShowChangePassword(false)
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pt-16">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <ProfileSidebar />

                    <div className="flex-1 space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold">Security Settings</h1>
                            <p className="text-muted-foreground mt-1">
                                Manage your account security and privacy settings
                            </p>
                        </div>

                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Password & Authentication</h2>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <Key className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Password</p>
                                            <p className="text-sm text-muted-foreground">
                                                Last changed 3 months ago
                                            </p>
                                        </div>
                                    </div>
                                    <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
                                        <DialogTrigger asChild>
                                            <Button>Change Password</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Change Password</DialogTitle>
                                                <DialogDescription>
                                                    Enter your current password and choose a new one
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleChangePassword} className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="currentPassword">Current Password</Label>
                                                    <Input
                                                        id="currentPassword"
                                                        type="password"
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="newPassword">New Password</Label>
                                                    <Input
                                                        id="newPassword"
                                                        type="password"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                    <Input
                                                        id="confirmPassword"
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    />
                                                </div>
                                                <div className="pt-4">
                                                    <Button type="submit" className="w-full">Update Password</Button>
                                                </div>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <Smartphone className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Two-Factor Authentication</p>
                                            <p className="text-sm text-muted-foreground">
                                                Add an extra layer of security to your account
                                            </p>
                                        </div>
                                    </div>
                                    <Switch />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Recovery Email</p>
                                            <p className="text-sm text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline">Update</Button>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Security Status</h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-green-600">
                                    <Check className="h-5 w-5" />
                                    <span>Your password is strong</span>
                                </div>
                                <div className="flex items-center gap-2 text-red-500">
                                    <X className="h-5 w-5" />
                                    <span>Two-factor authentication is not enabled</span>
                                </div>
                                <div className="flex items-center gap-2 text-green-600">
                                    <Check className="h-5 w-5" />
                                    <span>Email verification is complete</span>
                                </div>
                            </div>

                            <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-amber-800 dark:text-amber-400">
                                            Security Recommendation
                                        </p>
                                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                            Enable two-factor authentication to better protect your account
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Account Protection</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Your account is protected by industry-standard security measures
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm text-muted-foreground">
                                <div className="flex items-start gap-2">
                                    <Check className="h-4 w-4 mt-1 text-green-500" />
                                    <p>SSL/TLS encryption for all data transmission</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Check className="h-4 w-4 mt-1 text-green-500" />
                                    <p>Regular security audits and monitoring</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Check className="h-4 w-4 mt-1 text-green-500" />
                                    <p>Automatic account lockout after multiple failed login attempts</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}