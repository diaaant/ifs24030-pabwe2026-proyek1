import type { ActionResult } from "./apiHelper";
import { showErrorDialog, showToast } from "./toolsHelper";

/**
 * Tampilkan hasil aksi ke pengguna.
 * - Sukses: toast singkat (jika ada pesan).
 * - Gagal validasi (ada error per field): toast, detailnya tampil di form.
 * - Gagal lain: dialog error.
 */
export const notifyResult = <T>(result: ActionResult<T>, successMessage?: string): void => {
  if (result.ok) {
    if (successMessage) showToast(successMessage);
    return;
  }
  if (result.errors.length > 0) showToast(result.message, "error");
  else showErrorDialog(result.message);
};
