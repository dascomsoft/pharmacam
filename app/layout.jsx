import './globals.css'
import ScrollToTopMobile from "@/src/components/ScrollToTopMobile";

export const metadata = {
  title: 'Allo237 - Pharmacies Cameroun',
  description:
    'Trouvez une pharmacie ouverte en 0.3s, et une pharmacie de garde même sans internet juste après le premier chargement',

  icons: {
    icon: '/allo237logo.jpg',
    shortcut: '/allo237logo.jpg',
    apple: '/allo237logo.jpg',
  },

  themeColor: '#10B981',

  openGraph: {
    title: 'Allo237 - Pharmacies Cameroun',
    description:
      'Trouvez une pharmacie ouverte en 0.3s, et une pharmacie de garde même sans internet juste après le premier chargement',
    type: 'website',
    images: ['/allo237logo.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-900 text-white">
        {/* 📱 UX mobile optimisée */}
        <ScrollToTopMobile />
        {children}
      </body>
    </html>
  )
}
