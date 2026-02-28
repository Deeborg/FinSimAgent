import Image from 'next/image';
import vitLogo from '../app/vit_logo.png';
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full glass border-b">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Image src={vitLogo} alt="Vitora logo" width={36} height={36} className="rounded" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Business Finance Simulator
          </h1>
        </div>
      </div>
    </header>
  );
}
