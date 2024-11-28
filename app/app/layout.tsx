import { esES } from "@clerk/localizations";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import "./globals.css";

const customLocalization = {
  signUp: {
    start: {
      title: "Crea tu cuenta",
      subtitle: "para acceder a {{applicationName}}",
      actionText: "¿Tienes una cuenta?",
      actionLink: "Iniciar sesión",
    },
    // Add more customizations as needed
  },
  // Customize other components as needed
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={{ ...esES, ...customLocalization }}>
      <html lang="es">
        <body>
          <SignedIn>
            <header className="flex justify-end p-4 bg-gray-100">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "rounded-full",
                  },
                }}
                afterSignOutUrl="/"
              />
            </header>
          </SignedIn>

          <main className="p-4">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
