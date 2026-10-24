import { reactive } from "vue";
import type { FieldError } from "~/helpers/apiHelper";

/**
 * Composable untuk state form: nilai input dua arah, pesan error per field,
 * dan reset ke nilai awal.
 */
export function useInput<T extends Record<string, unknown>>(initial: T) {
  const initialValues = { ...initial };
  const values = reactive({ ...initial }) as T;
  const errors = reactive<Record<string, string>>({});

  const clearErrors = () => {
    Object.keys(errors).forEach((key) => delete errors[key]);
  };

  const setValues = (next: Partial<T>) => {
    Object.assign(values, next);
  };

  const reset = (next: Partial<T> = {}) => {
    Object.assign(values, initialValues, next);
    clearErrors();
  };

  /** Simpan error dari API; bila satu field punya beberapa error, yang pertama dipakai. */
  const setFieldErrors = (fieldErrors: FieldError[]) => {
    clearErrors();
    fieldErrors.forEach(({ field, message }) => {
      if (!(field in errors)) errors[field] = message;
    });
  };

  return { values, errors, setValues, reset, setFieldErrors, clearErrors };
}
