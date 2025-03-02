<script setup lang="ts">
import { computed, ref, reactive, onMounted } from "vue";
import axios from "axios";
import {
    PlusIcon,
    ArrowPathRoundedSquareIcon,
} from '@heroicons/vue/24/solid';

interface SupplierData {
    id: number;
    name: string;
    address: string;
    email: string;
    contactno: string;
}

const selectedSupplierId = ref<number | null>(null);
const supplierSearch = ref("");
const supplierDatas = ref<SupplierData[]>([]);
const messages = reactive({ edit: "", add: "", delete: "" });
const supplierForm = reactive({
  name: "",
  address: "",
  email: "",
  contactno: ""
});

const filteredSupplierDatas = computed(() =>

supplierDatas.value.filter(
    (e) =>
      e.name.toLowerCase().includes(supplierSearch.value.toLowerCase())
  )
);

const saveSupplier = async (isEdit: boolean) => {
  if (!supplierForm.name || !supplierForm.address || !supplierForm.email || !supplierForm.contactno) {
    messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
    return;
  }
  const contactNoRegex = /^\+?\d{12}$/;
  if (!contactNoRegex.test(supplierForm.contactno)) {
    messages[isEdit ? "edit" : "add"] = "Contact number should be in the format +639xxxxxxxxx or 09xxxxxxxxx.";
    return;
  }

  try {
    if (isEdit) {
      await axios.put(`http://localhost:3000/api/supplier/${selectedSupplierId.value}`, supplierForm);
      (document.getElementById("editSupplierModal") as HTMLDialogElement).close();
    } else {
      await axios.post("http://localhost:3000/api/supplier", supplierForm);
      (document.getElementById("addSupplierModal") as HTMLDialogElement).close();
    }
    loadSupplier();
  } catch (err) {
    messages[isEdit ? "edit" : "add"] = axios.isAxiosError(err) ? err.response?.data?.message || "Server error" : "Unexpected error.";
  }
};

const deleteSupplier = async () => {
  if (!selectedSupplierId.value) return (messages.delete = "No supplier selected.");

  try {
    await axios.delete(`http://localhost:3000/api/supplier/${selectedSupplierId.value}`);
    (document.getElementById("deleteSupplierModal") as HTMLDialogElement).close();
    loadSupplier();
  } catch (err) {
    messages.delete = axios.isAxiosError(err) ? err.response?.data?.message || "Server error" : "Unexpected error.";
  }
};
const loadSupplier = async () => {
  try {
    const [supplierRes] = await Promise.all([
      axios.get("http://localhost:3000/api/supplier"),
    ]);

    supplierDatas.value = supplierRes.data.map((supplier: any) => {
      return {
        id: supplier.Supplier_ID,
        name: supplier?.Supplier_Name || "",
        email: supplier?.Supplier_Email || "",
        address: supplier?.Supplier_Address || "",
        contactno: supplier?.Supplier_ContactNo || "",
      };
    });
  } catch (err) {
    console.error("Error loading suppliers:", err);
  }
};

const loadSupplierModal = (id: number, isEdit: boolean) => {
  selectedSupplierId.value = id;
  messages.edit = "";
  messages.add = "";
  messages.delete = "";

  const supplier = supplierDatas.value.find((e) => e.id === id);
  if (supplier && isEdit) {
    Object.assign(supplierForm, supplier);
  } else {
    Object.assign(supplierForm, supplier);
    if (id === 0) {
      Object.assign(supplierForm, {
        name: "",
        address: "",
        email: "",
        contactno: ""
      });
    }
  }
};

onMounted(loadSupplier);

</script>

<template>
    <div class="tg-widget">
        <div class="tg-widget-h">
            <div>
                Suppliers
            </div>
            <div class="flex">
                <label class="input text-[14px] text-black h-[32px] mr-2 grow bg-[#f7f2f2]">
                    <magnifying-glass-icon class="h-[20px] pr-1 " />
                    <input v-model="supplierSearch" type="search" class="grow" placeholder="Search Supplier Name">
                </label>
                <div @click="loadSupplier()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
                    <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
                </div>
                <div @click="loadSupplierModal(0, false)" onclick="addSupplierModal.showModal()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Supplier">
                    <plus-icon class="tg-widget-btn-icon" />
                </div>
            </div>
        </div>
        <div class="tg-table-container">
            <table class="tg-table">
                <thead>
                    <tr>
                        <td>Supplier</td>
                        <td>Address</td>
                        <td>Email Address</td>
                        <td>Contact No</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="supplier in filteredSupplierDatas" :key="supplier.id">
                        <td>{{ supplier.name }}</td>
                        <td>{{ supplier.address }}</td>
                        <td>{{ supplier.email }}</td>
                        <td>{{ supplier.contactno }}</td>
                        <td>
                            <div class="flex gap-[10px] justify-start !pr-[20px] ">
                                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                                    onclick="editSupplierModal.showModal()" @click="loadSupplierModal(supplier.id, true)">
                                    Edit
                                </button>
                                <button onclick="deleteSupplierModal.showModal()"  @click="loadSupplierModal(supplier.id, false)"
                                    class="btn h-[25px] p-[12px] shadow-md bg-[#fc5861] border-none">
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!--Add Supplier Modal-->
    <dialog id="addSupplierModal" class="modal">
      <div class="modal-box !max-w-[300px]">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="leading-none mb-1">
          <p class="text-lg font-bold">Add Supplier Info</p>
        </div>
        <div id="edit-form">
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Supplier Name:</p>
            <input v-model="supplierForm.name" type="text" placeholder="Supplier Name"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Address:</p>
            <input v-model="supplierForm.address" type="text" placeholder="Address"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Email Address:</p>
            <input v-model="supplierForm.email" type="text" placeholder="Email Address"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Contact No:</p>
            <input v-model="supplierForm.contactno" type="text" placeholder="Contact No."
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="text-xs pt-2 text-[#f00] text-wrap">{{ messages.add }}</div>
        </div>
        <div class="modal-action">
          <button @click="saveSupplier(false)" class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">
            Create Supplier</button>
        </div>
      </div>
    </dialog>

    <!--Edit Supplier Modal-->
    <dialog id="editSupplierModal" class="modal">
      <div class="modal-box !max-w-[300px]">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="leading-none mb-1">
          <p class="text-lg font-bold">Edit Supplier Info</p>
          <div class="flex items-center ">
            <p class="text-[11px]">for</p>
            <div class="text-[10px] ml-[5px] bg-[#b07166] text-white w-min m-min px-1 py-1 rounded-[15px]">
              {{supplierForm.name}}
            </div>
          </div>
        </div>
        <div id="edit-form">
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Supplier Name:</p>
            <input v-model="supplierForm.name" type="text" placeholder="Supplier Name"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Address:</p>
            <input v-model="supplierForm.address" type="text" placeholder="Address"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Email Address:</p>
            <input v-model="supplierForm.email" type="text" placeholder="Email Address"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Contact No:</p>
            <input v-model="supplierForm.contactno" type="text" placeholder="Contact No."
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="text-xs pt-2 text-[#f00] text-wrap">{{ messages.edit }}</div>
        </div>
        <div class="modal-action">
          <button @click="saveSupplier(true)" class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">Save
            Info</button>
        </div>
      </div>
    </dialog>

    <!--Delete Supplier Modal-->
    <dialog id="deleteSupplierModal" class="modal">
      <div class="modal-box !max-w-[390px] p-5">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="leading-none">
          <p class="text-lg font-bold">Do you really want to delete this supplier?</p>
          <div class="mt-1 text-xs fton-bold bg-[#b07166] text-white w-min m-min px-2 py-1 rounded-[15px]">
            {{supplierForm.name}}
          </div>
          <div class="text-xs pt-2 text-[#f00]">{{ messages.delete }}</div>
          <p class="text-[11px] mt-5">This action cannot be reversed</p>
          <button @click="deleteSupplier()" class="mt-1 btn btn-error shadow-xs h-7">Delete</button>
        </div>

      </div>
    </dialog>
</template>