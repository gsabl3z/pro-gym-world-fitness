import { AuthProvider } from "@/context/AuthContext"
import "./globals.css"

export const metadata = {
  title: "Pro Gym World Fitness",
  description: "Sistema de gestión para gimnasios",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
