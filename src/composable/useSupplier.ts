import { computed, ref, reactive, onMounted } from "vue";
import { SupplierData, supplierService } from "../api/supplier";
import axios from "axios";

export function useSupplier() {
  const selectedSupplierId = ref<number | null>(null);
  const supplierSearch = ref("");
  const supplierDatas = ref<SupplierData[]>([]);
  const messages = reactive({ edit: "", add: "", delete: "" });
  const supplierForm = reactive<SupplierData>({
    id: 0,
    name: "",
    address: "",
    email: "",
    contactno: "",
  });

  const filteredSupplierDatas = computed(() =>
    supplierDatas.value.filter(({ name }) =>
      name.toLowerCase().includes(supplierSearch.value.toLowerCase())
    )
  );

  const saveSupplier = async (isEdit: boolean) => {
    if (
      !supplierForm.name ||
      !supplierForm.address ||
      !supplierForm.email ||
      !supplierForm.contactno
    ) {
      messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
      return;
    }
    const contactNoRegex = /^\+?\d{12}$/;
    if (!contactNoRegex.test(supplierForm.contactno)) {
      messages[isEdit ? "edit" : "add"] =
        "Contact number should be in the format +639xxxxxxxxx or 09xxxxxxxxx.";
      return;
    }

    try {
      if (isEdit) {
        if (!selectedSupplierId.value)
          return (messages.edit = "No supplier selected.");
        await supplierService.updateSupplier(
          selectedSupplierId.value,
          supplierForm
        );
        (
          document.getElementById("editSupplierModal") as HTMLDialogElement
        ).close();
      } else {
        await supplierService.createSupplier(supplierForm);
        (
          document.getElementById("addSupplierModal") as HTMLDialogElement
        ).close();
      }
      loadSupplier();
    } catch (err) {
      messages[isEdit ? "edit" : "add"] = axios.isAxiosError(err)
        ? err.response?.data?.message || "Server error"
        : "Unexpected error.";
    }
  };

  const deleteSupplier = async () => {
    if (!selectedSupplierId.value)
      return (messages.delete = "No supplier selected.");

    try {
      await supplierService.deleteSupplier(selectedSupplierId.value);
      (
        document.getElementById("deleteSupplierModal") as HTMLDialogElement
      ).close();
      loadSupplier();
    } catch (err) {
      messages.delete = axios.isAxiosError(err)
        ? err.response?.data?.message || "Server error"
        : "Unexpected error.";
    }
  };

  const loadSupplier = async () => {
    try {
      const response = await supplierService.getSuppliers();
      supplierDatas.value = response.data.map((supplierData: any) => ({
        id: supplierData.Supplier_ID,
        name: supplierData.Supplier_Name,
        email: supplierData.Supplier_Email,
        address: supplierData.Supplier_Address,
        contactno: supplierData.Supplier_ContactNo,
      }));
    } catch (err) {
      console.error("Error loading suppliers:", err);
    }
  };

  onMounted(loadSupplier);

  return {
    supplierDatas,
    supplierSearch,
    filteredSupplierDatas,
    selectedSupplierId,
    supplierForm,
    messages,
    loadSupplier,
    saveSupplier,
    deleteSupplier,
  };
}
