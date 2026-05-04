import { Outlet, createRootRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "@/styles.css";

function NotFoundComponent() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-black text-gold">404</h1>
        <h2 className="mt-3 text-xl font-semibold">Lost in the multiverse</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page doesn't exist on TUNZIFY.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-gold text-accent-foreground px-5 py-2.5 font-semibold shadow-gold"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  notFoundComponent: NotFoundComponent,
  component: () => (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <Outlet />
      </main>
      <Footer />
    </>
  ),
});