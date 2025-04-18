"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, ArrowRight, CheckCircle, AlertCircle, LucideSparkles } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [tokenStatus, setTokenStatus] = useState<"validating" | "valid" | "invalid">("validating");
    const [tokenValidated, setTokenValidated] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    // Validate token on page load
    useEffect(() => {
        if (!token) {
            setTokenStatus("invalid");
            return;
        }

        // In a real app, you might want to validate the token with a backend API call
        // For now, we'll just assume it's valid if it exists
        setTokenStatus("valid");
        setTokenValidated(true);
    }, [token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }

        if (formData.newPassword.length < 8) {
            toast.error("Le mot de passe doit contenir au moins 8 caractères");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-reset-token`, {
                token,
                newPassword: formData.newPassword,
            });

            setLoading(false);
            setResetSuccess(true);

            // Redirect to login after a short delay
            setTimeout(() => {
                router.push("/auth/signin?reset=success");
            }, 3000);
        } catch (error: any) {
            setLoading(false);
            toast.error(error.response?.data?.error || "Échec de la réinitialisation du mot de passe.");
        }
    };

    if (resetSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 transition-colors duration-300 dark:from-blue-950 dark:to-purple-950">
                <Card className="w-full max-w-md border border-gray-200/50 bg-white/90 shadow-xl backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/90">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center text-xl font-medium">
                            <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                            Mot de passe réinitialisé
                        </CardTitle>
                        <CardDescription>
                            Votre mot de passe a été réinitialisé avec succès.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="mb-4 text-sm text-muted-foreground">
                            Vous allez être redirigé vers la page de connexion...
                        </p>
                        <Button
                            onClick={() => router.push("/auth/signin")}
                            className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 dark:from-blue-500 dark:to-purple-500"
                        >
                            Aller à la page de connexion
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (tokenStatus === "validating") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 transition-colors duration-300 dark:from-blue-950 dark:to-purple-950">
                <Card className="w-full max-w-md border border-gray-200/50 bg-white/90 shadow-xl backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/90">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl font-medium">
                            Vérification du token
                        </CardTitle>
                        <CardDescription>
                            Veuillez patienter pendant que nous vérifions votre lien...
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center py-6">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (tokenStatus === "invalid") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 transition-colors duration-300 dark:from-blue-950 dark:to-purple-950">
                <Card className="w-full max-w-md border border-gray-200/50 bg-white/90 shadow-xl backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/90">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center text-xl font-medium">
                            <AlertCircle className="mr-2 h-6 w-6 text-red-500" />
                            Lien invalide
                        </CardTitle>
                        <CardDescription>
                            Le lien de réinitialisation est invalide ou a expiré.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="mb-4 text-sm text-muted-foreground">
                            Veuillez demander un nouveau lien de réinitialisation.
                        </p>
                        <Button
                            onClick={() => router.push("/auth/signin")}
                            className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 dark:from-blue-500 dark:to-purple-500"
                        >
                            Retour à la connexion
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 p-4 transition-colors duration-300 dark:from-blue-950 dark:to-purple-950">
            {/* Tech-themed animated background (same as signin page) */}
            <div className="absolute inset-0 overflow-hidden opacity-50 dark:opacity-30">
                {/* Circuit board patterns */}
                <svg
                    className="absolute left-0 top-0 size-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <pattern
                        id="circuit-pattern"
                        x="0"
                        y="0"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 10 0 L 7 0 L 7 7 L 0 7 L 0 10 L 10 10 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.2"
                            className="text-blue-300 dark:text-blue-700"
                        />
                    </pattern>
                    <rect
                        x="0"
                        y="0"
                        width="100"
                        height="100"
                        fill="url(#circuit-pattern)"
                    />
                </svg>

                {/* Floating tech elements */}
                <div className="absolute left-10 top-10">
                    <motion.div
                        animate={{ y: [0, 15, 0], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="size-12 rounded-lg border border-blue-200 bg-blue-100/50 backdrop-blur-sm dark:border-blue-800 dark:bg-blue-900/30"
                    />
                </div>
                <div className="absolute right-20 top-20">
                    <motion.div
                        animate={{ y: [0, -20, 0], opacity: [0.5, 0.9, 0.5] }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                        className="size-16 rounded-full border border-purple-200 bg-purple-100/50 backdrop-blur-sm dark:border-purple-800 dark:bg-purple-900/30"
                    />
                </div>
            </div>

            {/* Halo effect behind card */}
            <div className="pointer-events-none absolute z-0">
                <motion.div
                    className="size-96 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl dark:from-blue-400/10 dark:to-purple-400/10"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            <div className="z-10 w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-6 text-center"
                >
                    <div className="mb-1 flex items-center justify-center">
                        <LucideSparkles className="mr-1 size-5 text-blue-600 dark:text-blue-400" />
                        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
                            TechVerse
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Réinitialisation de votre mot de passe
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="border border-gray-200/50 bg-white/90 shadow-xl backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/90">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-medium">Nouveau mot de passe</CardTitle>
                            <CardDescription>
                                Veuillez définir votre nouveau mot de passe
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="newPassword" className="text-xs font-medium">
                                        Nouveau mot de passe
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="Entrez votre nouveau mot de passe"
                                            value={formData.newPassword}
                                            onChange={(e) =>
                                                setFormData({ ...formData, newPassword: e.target.value })
                                            }
                                            className="h-9 pl-8 text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="confirmPassword" className="text-xs font-medium">
                                        Confirmer le mot de passe
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirmez votre mot de passe"
                                            value={formData.confirmPassword}
                                            onChange={(e) =>
                                                setFormData({ ...formData, confirmPassword: e.target.value })
                                            }
                                            className="h-9 pl-8 text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        className="h-9 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-sm hover:opacity-90 dark:from-blue-500 dark:to-purple-500"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                        <svg
                            className="-ml-1 mr-2 size-3.5 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                          <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                          ></circle>
                          <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Réinitialisation en cours...
                      </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                        Réinitialiser le mot de passe
                        <ArrowRight className="ml-1.5 size-3.5" />
                      </span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center pb-4 pt-0">
                            <div className="text-center text-xs text-muted-foreground">
                                Retour à la{" "}
                                <Link
                                    href="/auth/signin"
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    page de connexion
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}