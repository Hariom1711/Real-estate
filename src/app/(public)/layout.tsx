import Navbar from "@/components/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Shared Header Navigation */}
      <Navbar />

      {/* Page Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      {/* Shared Footer */}
      <footer className="w-full border-t border-border bg-card py-8 px-6 md:px-12 lg:px-16 text-center md:text-left text-sm text-muted-foreground transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-bold text-foreground tracking-wider">PUNE REALTY</span>
            <p className="mt-1 font-light text-xs text-muted-foreground">Premium homes, apartments, and luxury villas in prime locations.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="/listings" className="hover:text-foreground transition">Properties</a>
            <a href="/compare" className="hover:text-foreground transition">Compare</a>
            <a href="/contact" className="hover:text-foreground transition">Contact</a>
            <a href="/admin/login" className="hover:text-foreground transition">Admin</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-border/30 flex flex-col md:flex-row justify-between items-center text-xs gap-2">
          <p>© {new Date().getFullYear()} Pune Realty. All rights reserved.</p>
          <p className="font-light">Crafted for Portfolio Showcase</p>
        </div>
      </footer>
    </div>
  );
}
