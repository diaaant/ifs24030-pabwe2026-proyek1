import { describe, expect, it } from "vitest";
import { useInput } from "./useInput";

describe("useInput", () => {
  it("menyimpan nilai awal dan memperbaruinya", () => {
    const { values, setValues } = useInput({ name: "", age: 0 });

    setValues({ name: "Budi" });

    expect(values).toEqual({ name: "Budi", age: 0 });
  });

  it("menyimpan error pertama tiap field dan menghapusnya", () => {
    const { errors, setFieldErrors, clearErrors } = useInput({ email: "" });

    setFieldErrors([
      { field: "email", message: "Wajib diisi" },
      { field: "email", message: "Tidak valid" },
    ]);
    expect(errors).toEqual({ email: "Wajib diisi" });

    clearErrors();
    expect(errors).toEqual({});
  });

  it("reset mengembalikan nilai awal, menerima nilai baru, dan membersihkan error", () => {
    const { values, errors, setValues, setFieldErrors, reset } = useInput({ name: "", color: "putih" });
    setValues({ name: "Budi", color: "merah" });
    setFieldErrors([{ field: "name", message: "x" }]);

    reset();
    expect(values).toEqual({ name: "", color: "putih" });
    expect(errors).toEqual({});

    reset({ name: "Rotua" });
    expect(values).toEqual({ name: "Rotua", color: "putih" });
  });
});
