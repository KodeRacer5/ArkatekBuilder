export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}>
      <body style={{ margin: 0, padding: 0, background: '#000', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}



