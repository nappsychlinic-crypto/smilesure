import type { Metadata } from "next";
import { AuthProvider } from "@/components/webapp/AuthContext";

export const metadata: Metadata = {
    title: "Login | SmileSure Dental Care",
    description: "Sign in to your SmileSure account",
};

export default function WebAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthProvider>{children}</AuthProvider>;
}
