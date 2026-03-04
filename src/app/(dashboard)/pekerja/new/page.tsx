import { getCompanies } from '@/lib/actions/pekerja';
import { PekerjaForm } from '@/components/pekerja/PekerjaForm';

export default async function NewPekerjaPage() {
  const { data: companies, success } = await getCompanies();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pekerja Baru</h1>
        <p className="text-muted-foreground">
          Sila isi maklumat pekerja di bawah.
        </p>
      </div>

      <PekerjaForm companies={success ? companies : []} />
    </div>
  );
}
