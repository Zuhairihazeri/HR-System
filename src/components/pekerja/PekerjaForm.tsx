'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPekerja, updatePekerja } from '@/lib/actions/pekerja';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface PekerjaFormProps {
  initialData?: any;
  companies: any[];
}

export function PekerjaForm({ initialData, companies }: PekerjaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initialData;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      position: formData.get('position') as string,
      companyId: formData.get('companyId') as string,
    };

    try {
      let response;
      if (isEdit) {
        response = await updatePekerja(initialData.id, data);
      } else {
        response = await createPekerja(data);
      }

      if (response.success) {
        router.push('/pekerja');
        router.refresh();
      } else {
        setError(response.error || 'Something went wrong');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Maklumat Pekerja' : 'Tambah Pekerja Baru'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nama Pertama</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={initialData?.firstName}
                required
                placeholder="cth: Ahmad"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nama Keluarga</Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={initialData?.lastName}
                required
                placeholder="cth: Abu"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={initialData?.email}
              required
              placeholder="ahmad@company.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">No. Telefon</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={initialData?.phone}
              placeholder="+60123456789"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Jawatan</Label>
            <Input
              id="position"
              name="position"
              defaultValue={initialData?.position}
              required
              placeholder="cth: Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyId">Syarikat</Label>
            <Select name="companyId" defaultValue={initialData?.companyId || ''} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Syarikat" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Kemaskini' : 'Simpan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
