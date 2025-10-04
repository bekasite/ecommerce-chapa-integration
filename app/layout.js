import { CartProvider } from '../components/CartContext';
import '../styles/globals.css';

export const metadata = {
  title: 'ShopNow - E-commerce',
  description: 'Your favorite online store',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}