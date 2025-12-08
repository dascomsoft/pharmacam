// import './globals.css';
// import { Inter } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'Pharmacam - Urgence Médicale 24h/24',
//   description: 'Trouvez une pharmacie de garde en parlant, même à 3h du matin. Yaoundé et Douala.',
//   themeColor: '#0F172A',
//   manifest: '/manifest.json',
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="fr" className="dark">
//       <head>
//         <link rel="icon" href="/favicon.ico" />
//         <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
//         <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
//       </head>
//       <body className={`${inter.className} bg-secondary text-gray-100 min-h-screen`}>
//         {/* Fond dégradé */}
//         <div className="fixed inset-0 bg-gradient-to-br from-secondary via-secondary-light to-black opacity-90 -z-10" />
        
//         {/* Éléments de décoration */}
//         <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
        
//         {children}
        
//         {/* Script pour PWA */}
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
//                 window.addEventListener('load', () => {
//                   navigator.serviceWorker.register('/sw.js');
//                 });
//               }
//             `,
//           }}
//         />
//       </body>
//     </html>
//   );
// }



import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pharmacam - Urgence Médicale 24h/24',
  description: 'Trouvez une pharmacie de garde en parlant, même à 3h du matin. Yaoundé et Douala.',
  themeColor: '#0F172A',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${inter.className}`} style={{
        background: 'var(--secondary)',
        color: '#F8FAFC',
        minHeight: '100vh'
      }}>
        {children}
        
        {/* Script pour PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}