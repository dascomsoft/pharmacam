import './globals.css'

export const metadata = {
  title: 'Pharmacam - Pharmacies Cameroun',
  description: 'Trouvez une pharmacie ouverte en 0.3s, même sans internet',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-900 text-white">
        {children}
      </body>
    </html>
  )
}
