export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <title>Slot Oyunu</title>
        <meta name="description" content="Basit bir slot oyunu" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
} 