<script setup lang="ts">
import { computed, ref, reactive, onMounted } from "vue";
import axios from "axios";
import {
    PlusIcon,
    ArrowPathRoundedSquareIcon,
} from '@heroicons/vue/24/solid';

interface BrandData {
    id: number;
    name: string;
}

const selectedBrandId = ref<number | null>(null);
const brandSearch = ref("");
const brandDatas = ref<BrandData[]>([]);
const messages = reactive({ edit: "", add: "", delete: "" });
const brandForm = reactive({
  name: ""
});

const filteredBrandDatas = computed(() =>

brandDatas.value.filter(
    (e) =>
      e.name.toLowerCase().includes(brandSearch.value.toLowerCase())
  )
);

const saveBrand = async (isEdit: boolean) => {
  if (!brandForm.name) {
    messages[isEdit ? "edit" : "add"] = "Please fill in the name.";
    return;
  }

  try {
    if (isEdit) {
      await axios.put(`http://localhost:3000/api/brand/${selectedBrandId.value}`, brandForm);
      (document.getElementById("editBrandModal") as HTMLDialogElement).close();
    } else {
      await axios.post("http://localhost:3000/api/brand", brandForm);
      (document.getElementById("addBrandModal") as HTMLDialogElement).close();
    }
    loadBrand();
  } catch (err) {
    messages[isEdit ? "edit" : "add"] = axios.isAxiosError(err) ? err.response?.data?.message || "Server error" : "Unexpected error.";
  }
};

const deleteBrand = async () => {
  if (!selectedBrandId.value) return (messages.delete = "No brand selected.");

  try {
    await axios.delete(`http://localhost:3000/api/brand/${selectedBrandId.value}`);
    (document.getElementById("deleteBrandModal") as HTMLDialogElement).close();
    loadBrand();
  } catch (err) {
    messages.delete = axios.isAxiosError(err) ? err.response?.data?.message || "Server error" : "Unexpected error.";
  }
};
const loadBrand = async () => {
  try {
    const [brandRes] = await Promise.all([
      axios.get("http://localhost:3000/api/brand"),
    ]);

    brandDatas.value = brandRes.data.map((brand: any) => {
      return {
        id: brand.Brand_ID,
        name: brand?.Brand_Name || "",
      };
    });
  } catch (err) {
    console.error("Error loading brands:", err);
  }
};

const loadBrandModal = (id: number, isEdit: boolean) => {
  selectedBrandId.value = id;
  messages.edit = "";
  messages.add = "";
  messages.delete = "";

  const brand = brandDatas.value.find((e) => e.id === id);
  if (brand && isEdit) {
    Object.assign(brandForm, brand);
  } else {
    Object.assign(brandForm, brand);
    if (id === 0) {
      Object.assign(brandForm, {
        name: ""
      });
    }
  }
};

onMounted(loadBrand);

</script>

<template>
    <div class="tg-widget">
        <div class="tg-widget-h">
            <div>
                Brands
            </div>
            <div class="flex">
                <label class="input text-[14px] text-black h-[32px] mr-2 grow bg-[#f7f2f2]">
                    <magnifying-glass-icon class="h-[20px] pr-1 " />
                    <input v-model="brandSearch" type="search" class="grow" placeholder="Search Brand Name">
                </label>
                <div @click="loadBrand()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
                    <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
                </div>
                <div @click="loadBrandModal(0, false)" onclick="addBrandModal.showModal()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Brand">
                    <plus-icon class="tg-widget-btn-icon" />
                </div>
            </div>
        </div>
        <div class="tg-table-container">
            <table class="tg-table">
                <thead>
                    <tr>
                        <td>Brand Name</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="brand in filteredBrandDatas" :key="brand.id">
                        <td>{{ brand.name }}</td>
                        <td>
                            <div class="flex gap-[10px] justify-start !pr-[20px] ">
                                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                                    onclick="editBrandModal.showModal()" @click="loadBrandModal(brand.id, true)">
                                    Edit
                                </button>
                                <button onclick="deleteBrandModal.showModal()"  @click="loadBrandModal(brand.id, false)"
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

    <!--Add Brand Modal-->
    <dialog id="addBrandModal" class="modal">
      <div class="modal-box !max-w-[300px]">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="leading-none mb-1">
          <p class="text-lg font-bold">Add Brand Info</p>
        </div>
        <div id="edit-form">
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Brand Name:</p>
            <input v-model="brandForm.name" type="text" placeholder="Brand Name"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="text-xs pt-2 text-[#f00] text-wrap">{{ messages.add }}</div>
        </div>
        <div class="modal-action">
          <button @click="saveBrand(false)" class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">
            Create Brand</button>
        </div>
      </div>
    </dialog>

    <!--Edit Brand Modal-->
    <dialog id="editBrandModal" class="modal">
      <div class="modal-box !max-w-[300px]">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="leading-none mb-1">
          <p class="text-lg font-bold">Edit Brand Info</p>
          <div class="flex items-center ">
            <p class="text-[11px]">for</p>
            <div class="text-[10px] ml-[5px] bg-[#b07166] text-white w-min m-min px-1 py-1 rounded-[15px]">
              {{brandForm.name}}
            </div>
          </div>
        </div>
        <div id="edit-form">
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Brand Name:</p>
            <input v-model="brandForm.name" type="text" placeholder="Brand Name"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="text-xs pt-2 text-[#f00] text-wrap">{{ messages.edit }}</div>
        </div>
        <div class="modal-action">
          <button @click="saveBrand(true)" class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">Save
            Info</button>
        </div>
      </div>
    </dialog>

    <!--Delete Brand Modal-->
    <dialog id="deleteBrandModal" class="modal">
      <div class="modal-box !max-w-[390px] p-5">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="leading-none">
          <p class="text-lg font-bold">Do you really want to delete this brand?</p>
          <div class="mt-1 text-xs fton-bold bg-[#b07166] text-white w-min m-min px-2 py-1 rounded-[15px]">
            {{brandForm.name}}
          </div>
          <div class="text-xs pt-2 text-[#f00]">{{ messages.delete }}</div>
          <p class="text-[11px] mt-5">This action cannot be reversed</p>
          <button @click="deleteBrand()" class="mt-1 btn btn-error shadow-xs h-7">Delete</button>
        </div>

      </div>
    </dialog>
</template>