export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <title>Slot Oyunu</title>
        <meta name="description" content="Basit bir slot oyunu" />
      </head>
      <body 
        style={{ 
          background: '#1a1b26', 
          margin: 0, 
          minHeight: '100vh' 
        }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
} 