'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

const formSchema = z.object({
  firstName: z.string().min(2, 'Nama pertama sekurang-kurangnya 2 aksara'),
  lastName: z.string().min(2, 'Nama keluarga sekurang-kurangnya 2 aksara'),
  email: z.string().email('Sila masukkan email yang sah'),
  phone: z.string().optional(),
  position: z.string().min(2, 'Sila masukkan jawatan'),
  companyId: z.string().min(1, 'Sila pilih syarikat'),
});

type FormValues = z.infer<typeof formSchema>;

interface PekerjaFormProps {
  initialData?: any;
  companies: any[];
}

export function PekerjaForm({ initialData, companies }: PekerjaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      companyId: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setLoading(true);
    setError(null);

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
    <Card className="max-w-2xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Maklumat Pekerja' : 'Tambah Pekerja Baru'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nama Pertama</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="cth: Ahmad"
              />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nama Keluarga</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="cth: Abu"
              />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="ahmad@company.com"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">No. Telefon</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="+60123456789"
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Jawatan</Label>
            <Input
              id="position"
              {...register('position')}
              placeholder="cth: Software Engineer"
            />
            {errors.position && <p className="text-xs text-destructive">{errors.position.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyId">Syarikat</Label>
            <Controller
              name="companyId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
              )}
            />
            {errors.companyId && <p className="text-xs text-destructive">{errors.companyId.message}</p>}
          </div>

          {error && <p className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md">{error}</p>}

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="min-w-32">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Kemaskini' : 'Simpan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

