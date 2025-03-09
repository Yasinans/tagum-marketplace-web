<script setup lang="ts">
import { PlusIcon, ArrowPathRoundedSquareIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { useSupplier } from '../../../composable/useSupplier';

const { selectedSupplierId, supplierSearch, supplierDatas, filteredSupplierDatas, messages, supplierForm, loadSupplier, saveSupplier, deleteSupplier } = useSupplier();
const loadSupplierModal = (id: number, isEdit: boolean) => {
    selectedSupplierId.value = id;
    Object.assign(messages, { edit: "", add: "", delete: "" });

    const supplier = supplierDatas.value.find((e) => e.id === id);
    Object.assign(
      supplierForm,
      isEdit && supplier
        ? supplier
        : { id: 0, name: "", address: "", email: "", contactno: "" }
    );
  };


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
                                <button onclick="deleteSupplierModal.showModal()"  @click="supplierForm.name=supplier.name;selectedSupplierId=supplier.id"
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