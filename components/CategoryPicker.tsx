'use client';

import { useEffect, useMemo, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useFlashMessage } from '@/lib/useFlashMessage';
import { getCategories } from '@/lib/api';
import type { Category } from '@/types/category';

interface CategoryPickerProps {
  selected: string[];
  onChange: (names: string[]) => void;
}

export default function CategoryPicker({ selected, onChange }: CategoryPickerProps) {
  const { pushMessage } = useFlashMessage();
  const [groupedCategories, setGroupedCategories] = useState<Record<string, Category[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const grouped = await getCategories();
        if (grouped && typeof grouped === 'object') {
          setGroupedCategories(grouped);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (err) {
        console.error('❌ Category fetch error:', err);
        pushMessage('Failed to load categories.', 'top-right', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const flatCategories = useMemo(
    () => Object.values(groupedCategories).flat(),
    [groupedCategories]
  );

  const selectedOptions = useMemo(() => {
    return selected.map((name) => {
      const match = flatCategories.find((cat) => cat.name === name);
      return {
        value: name,
        label: match?.name || name,
      };
    });
  }, [selected, flatCategories]);

  const groupedOptions = useMemo(() => {
    return Object.entries(groupedCategories).map(([label, cats]) => ({
      label,
      options: cats.map((cat) => ({
        label: cat.name,
        value: cat.name,
      })),
    }));
  }, [groupedCategories]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading categories…</p>;
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-900">Categories</label>
      <CreatableSelect
        isMulti
        value={selectedOptions}
        onChange={(selectedOptions) => {
          const names = Array.isArray(selectedOptions)
            ? selectedOptions.map((opt) => opt.value)
            : [];
          onChange(names);
        }}
        options={groupedOptions}
        className="mt-1"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#0d9488', // teal-600
            primary25: '#ccfbf1', // teal-100
            primary50: '#99f6e4', // teal-200
          },
        })}
      />
    </div>
  );
}
