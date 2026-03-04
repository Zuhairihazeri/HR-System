import { getPekerjaById, getCompanies } from '@/lib/actions/pekerja';
import { PekerjaForm } from '@/components/pekerja/PekerjaForm';
import { notFound } from 'next/navigation';

export default async function EditPekerjaPage({ params }: { params: { id: string } }) {
  const { data: employee, success: employeeSuccess } = await getPekerjaById(params.id);
  const { data: companies, success: companiesSuccess } = await getCompanies();

  if (!employeeSuccess || !employee) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Pekerja</h1>
        <p className="text-muted-foreground">
          Kemaskini maklumat {employee.firstName} {employee.lastName} di bawah.
        </p>
      </div>

      <PekerjaForm 
        initialData={employee} 
        companies={companiesSuccess ? companies : []} 
      />
    </div>
  );
}
