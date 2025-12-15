import './globals.css'

export const metadata = {
  title: 'Allo237 - Pharmacies Cameroun',
  description: 'Trouvez une pharmacie ouverte en 0.3s, et une pharmacie de garde même sans internet juste après le premier chargement',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Favicon unique */}
        <link rel="icon" href="/allo237logo.jpg" type="image/jpeg" />
        
        {/* Pour une meilleure compatibilité, tu peux aussi ajouter une version ICO */}
        <link rel="shortcut icon" href="/allo237logo.jpg" />
        
        {/* Pour iOS */}
        <link rel="apple-touch-icon" href="/allo237logo.jpg" />
        
        {/* Theme color vert pour correspondre à ton design */}
        <meta name="theme-color" content="#10B981" />
        
        {/* Balises importantes pour le SEO et le partage */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/allo237logo.jpg" />
      </head>
      <body className="min-h-screen bg-gray-900 text-white">
        {children}
      </body>
    </html>
  )
}