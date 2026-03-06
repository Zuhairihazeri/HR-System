'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { deletePekerja } from '@/lib/actions/pekerja';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PekerjaTableProps {
  employees: any[];
}

export function PekerjaTable({ employees }: PekerjaTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onDelete(id: string) {
    if (!confirm('Adakah anda pasti mahu memadam pekerja ini?')) return;
    
    setDeletingId(id);
    try {
      const response = await deletePekerja(id);
      if (response.success) {
        router.refresh();
      } else {
        alert('Gagal memadam pekerja');
      }
    } catch (error) {
      alert('Ralat berlaku semasa memadam');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Jawatan</TableHead>
            <TableHead>Syarikat</TableHead>
            <TableHead className="text-right">Tindakan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  {employee.firstName} {employee.lastName}
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.company?.name || 'Tiada Syarikat'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/pekerja/${employee.id}`}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(employee.id)}
                      disabled={deletingId === employee.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Tiada pekerja dijumpai.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
