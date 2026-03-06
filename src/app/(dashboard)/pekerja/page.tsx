import { getPekerja } from '@/lib/actions/pekerja';
import { PekerjaTable } from '@/components/pekerja/PekerjaTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default async function PekerjaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { data: employees, success } = await getPekerja(q);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Senarai Pekerja</h1>
          <p className="text-muted-foreground">
            Urus maklumat peribadi dan jawatan pekerja anda.
          </p>
        </div>
        <Link href="/pekerja/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Pekerja
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <form className="relative flex-1 max-w-sm" action="/pekerja" method="GET">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            name="q"
            defaultValue={q}
            placeholder="Cari pekerja..." 
            className="pl-10" 
          />
          <button type="submit" className="hidden" />
        </form>
        <Button variant="outline">Filter</Button>
      </div>

      <PekerjaTable employees={success && employees ? employees : []} />
    </div>
  );
}
