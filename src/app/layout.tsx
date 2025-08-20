import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { OrganizationStructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Moo Beef Steak Prime - Where Prime Cuts Meet Perfection",
  description: "Nhà hàng beefsteak cao cấp tại TP.HCM. Thưởng thức những miếng thịt bò prime tươi ngon, được chế biến hoàn hảo trong không gian sang trọng.",
  keywords: ["beefsteak", "nhà hàng", "thịt bò", "prime cuts", "steak house", "fine dining", "Ho Chi Minh City"],
  icons: "/images/logo/res.png",
  openGraph: {
    title: "Moo Beef Steak Prime",
    description: "Where Prime Cuts Meet Perfection",
    images: ["/images/og-image.jpg"],
    type: "website",
    siteName: "Moo Beef Steak Prime",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moo Beef Steak Prime",
    description: "Where Prime Cuts Meet Perfection",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import ClientLayout from "@/components/layout/ClientLayout";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <OrganizationStructuredData />
      </head>
      <body>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
