<script setup lang="ts">
import { computed, ref, reactive, onMounted } from "vue";
import axios from "axios";
import {
  PlusIcon,
  ArrowPathRoundedSquareIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/solid';

interface ProductPackagingData {
  Product_Name: string;
  Bar_Code: string;
  Product_ID: number;
  Unit_Weight: number;
  Unit_Size: string;
  Unit_Price: number;
}

//to be deleted
const employeeId = ref('');
const updateEmployeeId = () => {
    const token = localStorage.getItem("token") || "";
    const payload = JSON.parse(atob(token.split('.')[1]));
    return employeeId.value = payload.id
}
updateEmployeeId();
//
const selectedProductPackagingId = ref<string | null>(null);
const productPackagingSearch = ref("");
const productPackagingDatas = ref<ProductPackagingData[]>([]);
const messages = reactive({ edit: "", add: "", delete: "" });
const productPackagingForm = reactive({
  Product_Name: "",
  Bar_Code: "",
  Product_ID: null,
  Unit_Weight: 0,
  Unit_Size: "",
  Unit_Price: 0
});

const products = ref<{ Product_ID: number, Product_Name: string, Supplier_ID: number, Supplier_Name: string, Brand_ID: number, Brand_Name: string }[]>([]);

const filteredProductPackagingDatas = computed(() =>
  productPackagingDatas.value.filter(
    (e) =>
      e.Product_Name.toLowerCase().includes(productPackagingSearch.value.toLowerCase()) ||
      e.Bar_Code.toLowerCase().includes(productPackagingSearch.value.toLowerCase())
  )
);

const saveProductPackaging = async (isEdit: boolean) => {
  if (!productPackagingForm.Bar_Code || productPackagingForm.Product_ID === null || !productPackagingForm.Unit_Weight || !productPackagingForm.Unit_Size || !productPackagingForm.Unit_Price) {
    messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
    return;
  }
  const { Bar_Code, Product_ID, Unit_Weight, Unit_Size, Unit_Price } = productPackagingForm;
  try {
    if (isEdit) {
      await axios.put(`http://localhost:3000/api/productpackaging/${selectedProductPackagingId.value}`, { newBarCode: Bar_Code, productId: Product_ID, unitWeight: Unit_Weight, unitSize: Unit_Size, unitPrice: Unit_Price });
      (document.getElementById("editProductPackagingModal") as HTMLDialogElement).close();
    } else {
      await axios.post("http://localhost:3000/api/productpackaging", { barCode: Bar_Code, productId: Product_ID, unitWeight: Unit_Weight, unitSize: Unit_Size, unitPrice: Unit_Price });
      (document.getElementById("addProductPackagingModal") as HTMLDialogElement).close();
    }
    loadProductPackaging();
  } catch (err) {
    messages[isEdit ? "edit" : "add"] = axios.isAxiosError(err) ? err.response?.data?.message || "Server error" : "Unexpected error.";
  }
};

const deleteProductPackaging = async () => {
  if (!selectedProductPackagingId.value) return (messages.delete = "No product packaging selected.");

  try {
    await axios.delete(`http://localhost:3000/api/productpackaging/${selectedProductPackagingId.value}`);
    (document.getElementById("deleteProductPackagingModal") as HTMLDialogElement).close();
    loadProductPackaging();
  } catch (err) {
    messages.delete = axios.isAxiosError(err) ? err.response?.data?.message || "Server error" : "Unexpected error.";
  }
};

const loadProductPackaging = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/productpackaging");
    productPackagingDatas.value = res.data;
  } catch (err) {
    console.error("Error loading product packagings:", err);
  }
};

const loadProducts = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/product");
    products.value = res.data;
  } catch (err) {
    console.error("Error loading products:", err);
  }
};

const loadProductPackagingModal = (id: string, isEdit: boolean) => {
  selectedProductPackagingId.value = id;
  messages.edit = "";
  messages.add = "";
  messages.delete = "";

  const productPackaging = productPackagingDatas.value.find((e) => e.Bar_Code === id);
  if (productPackaging && isEdit) {
    Object.assign(productPackagingForm, productPackaging);
  } else {
    Object.assign(productPackagingForm, productPackaging);
    if (id === "") {
      Object.assign(productPackagingForm, {
      Product_Name: "",
      Bar_Code: "",
      Product_ID: null,
      Unit_Weight: 0,
      Unit_Size: "",
      Unit_Price: 0
    });
    }

  }
};

onMounted(() => {
  loadProductPackaging();
  loadProducts();
});

const supplyDatas = ref<{ Supply_ID: number, Supplier_id: number, Employee_id: number, supply_date: string, Supplier_Name: string, Employee_Name: string }[]>([]);
const supplyDetailDatas = ref<{ SupplyDetail_ID: number, Supply_ID: number, Bar_Code: string, Quantity: number, Unit_Price: string, Expiry: string, Subtotal: string }[]>([]);

const filteredSupplyDetailDatas = computed(() =>
  supplyDetailDatas.value.filter(
    (e) =>
      !selectedProductPackagingId.value ||
      e.Bar_Code === selectedProductPackagingId.value
  )
);
const loadSupply = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/supply");
    supplyDatas.value = res.data;
  } catch (err) {
    console.error("Error loading supply:", err);
  }
};

const loadSupplyDetails = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/supplydetails");
    supplyDetailDatas.value = res.data;
  } catch (err) {
    console.error("Error loading supply details:", err);
  }
};

const selectedSupplyId = ref<number | null>(null);
const selectedRemoveRemarksId = ref<number | null>(null);
const selectedSupplyDetailId = ref<number | null>(null);
const removeSupplyDetail = async () => {
  if (!selectedSupplyDetailId) return (messages.delete = "No supply detail selected.");
  try {
    await axios.post(`http://localhost:3000/api/stockout/`, 
        { supplyDetailId: selectedSupplyDetailId.value, 
          employeeId: employeeId.value, 
          remarksId: selectedRemoveRemarksId.value });
    loadSupplyDetails();
    (document.getElementById("removeSupplyDetailModal") as HTMLDialogElement).close();
  } catch (err) {
    messages.delete = axios.isAxiosError(err) ? err.response?.data?.message || "Server error" : "Unexpected error.";
  }
};

onMounted(() => {
  loadRemarks();
  loadSupply();
  loadSupplyDetails();
});

const remarks = ref<{ Remarks_ID: number, Remarks: string }[]>([]);

const loadRemarks = async () => {
  try {
    const response = await axios.get<{ Remarks_ID: number, Remarks: string }[]>("http://localhost:3000/api/remarks");
    remarks.value = response.data;
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <div class="tg-widget w-[100%]">
    <div class="tg-widget-h">
      <div>
        Product Packagings
      </div>
      <div class="flex">
        <label class="input text-[14px] text-black min-w-[270px] h-[32px] mr-2 grow bg-[#f7f2f2]">
          <magnifying-glass-icon class="h-[20px] pr-1 " />
          <input v-model="productPackagingSearch" type="search" class="grow"
            placeholder="Search Product Name or Barcode">
        </label>
        <div @click="loadProductPackaging()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
          <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
        </div>
        <div @click="loadProductPackagingModal('', false)" onclick="addProductPackagingModal.showModal()"
          class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Product Packaging">
          <plus-icon class="tg-widget-btn-icon" />
        </div>
      </div>
    </div>
    <div class="tg-table-container">
      <table class="tg-table">
        <thead>
          <tr>
            <td>Product Name</td>
            <td>Barcode</td>
            <td>Unit Weight</td>
            <td>Unit Price</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="productPackaging in filteredProductPackagingDatas" :key="productPackaging.Product_ID">
            <td>{{ productPackaging.Product_Name }}</td>
            <td>{{ productPackaging.Bar_Code }}</td>
            <td>{{ Math.round(productPackaging.Unit_Weight * 100) / 100 }}{{ productPackaging.Unit_Size }}</td>
            <td>₱{{ productPackaging.Unit_Price }}</td>
            <td>
              <div class="flex gap-[10px] justify-start !pr-[20px] ">
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="viewProductStocksModal.showModal()" @click="loadProductPackagingModal(productPackaging.Bar_Code, false)">
                  View Stocks
                </button>
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="editProductPackagingModal.showModal()"
                  @click="loadProductPackagingModal(productPackaging.Bar_Code, true)">
                  Edit
                </button>
                <button onclick="deleteProductPackagingModal.showModal()"
                  @click="loadProductPackagingModal(productPackaging.Bar_Code, false)"
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

  <!--View Product Stocks Modal-->
  <dialog id="viewProductStocksModal" class="modal">
    <div class="modal-box !max-w-[600px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">View Product Stocks</p>
        <div class="flex items-center ">
          <p class="text-[11px]">for</p>
          <div class="text-[10px] ml-[5px] bg-[#b07166] text-white w-min m-min px-1 py-1 rounded-[15px]">
            {{ selectedProductPackagingId }}
          </div>
        </div>
      </div>
      <!--list-->
      <div>
        <ul class="list bg-base-100 rounded-box shadow-md mt-5">
          <li v-for="supplyDetail in filteredSupplyDetailDatas" :key="supplyDetail.Supply_ID" class="list-row">
            <div class="pr-5 border-r border-gray-300">
              <div>Supply #</div>
              <div class="text-xs uppercase font-semibold opacity-60">{{ supplyDetail.Supply_ID }}</div>
            </div>
            <div>
              <div class="font-semibold">{{ supplyDatas.find(supplier => supplier.Supply_ID === supplyDetail.Supply_ID)?.Supplier_Name }}</div>
              <div class="text-xs uppercase font-semibold opacity-60">
                QUANTITY: {{ supplyDetail.Quantity }} PCS, EXPIRY DATE: {{ new Date(supplyDetail.Expiry).toLocaleDateString() }}
              </div>
            </div>
            <button @click="selectedSupplyId = supplyDetail.Supply_ID; selectedSupplyDetailId = supplyDetail.SupplyDetail_ID" onclick="removeSupplyDetailFromPackageModal.showModal()" class="btn btn-ghost border-gray-300">
              Remove
            </button>
          </li>
        </ul>
      </div>
    </div>
  </dialog>

  
  <!--Remove Supply Detail Modal-->
  <dialog id="removeSupplyDetailFromPackageModal" class="modal">
    <div class="modal-box !max-w-[300px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">Remove From Stocks</p>
        <div class="flex items-center ">
          <p class="text-[11px]">for Supply No. </p>
          <div class="text-[10px] ml-[5px] bg-[#b07166] text-white w-min m-min px-1 py-1 rounded-[15px]">
            {{ selectedSupplyId }}
          </div>
        </div>
      </div>
      <div id="edit-form">
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Select Reasons:</p>
          <select v-model="selectedRemoveRemarksId" class="rounded-[6px] px-2 py-1 max-w-xs">
            <option v-for="remark in remarks" :value="remark.Remarks_ID" :key="remark.Remarks_ID">{{ remark.Remarks }}</option>
          </select>
        </div>
        <div class="text-xs pt-2 text-[#f00] text-wrap">{{ messages.edit }}</div>
      </div>
      <div class="modal-action">
        <button @click="removeSupplyDetail()" class="btn shadow-md text-[#3f1e61] border-[#877cde] border-1 h-9">
          Stock Out
        </button>
      </div>
    </div>
  </dialog>

  <!--Add Product Packaging Modal-->
  <dialog id="addProductPackagingModal" class="modal">
    <div class="modal-box !max-w-[300px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">Add Product Packaging Info</p>
      </div>
      <div id="edit-form">
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Product:</p>
          <select v-model="productPackagingForm.Product_ID" class="rounded-[6px] px-2 py-1 max-w-xs">
            <option v-for="product in products" :value="product.Product_ID" :key="product.Product_ID">{{
              product.Product_Name }}</option>
          </select>
        </div>
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Barcode:</p>
          <input v-model="productPackagingForm.Bar_Code" type="text" placeholder="Barcode"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
        </div>
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Unit Weight:</p>
          <input v-model="productPackagingForm.Unit_Weight" type="number" placeholder="Unit Weight"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
        </div>
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Unit Size: (mg,g,ml,l,etc)</p>
          <input v-model="productPackagingForm.Unit_Size" type="text" placeholder="Unit Size"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
        </div>
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Price:</p>
          <input v-model="productPackagingForm.Unit_Price" type="number" placeholder="Unit Price"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
        </div>
        <div class="text-xs pt-2 text-[#f00] text-wrap">{{ messages.add }}</div>
      </div>
      <div class="modal-action">
        <button @click="saveProductPackaging(false)"
          class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">
          Create Product Packaging</button>
      </div>
    </div>
  </dialog>

  <!--Edit Product Packaging Modal-->
  <dialog id="editProductPackagingModal" class="modal">
    <div class="modal-box !max-w-[300px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">Edit Product Packaging Info</p>
        <div class="flex items-center ">
          <p class="text-[11px]">for</p>
          <div class="text-[10px] ml-[5px] bg-[#b07166] text-white w-min m-min px-1 py-1 rounded-[15px]">
            {{ productPackagingForm.Bar_Code }}
          </div>
        </div>
      </div>
      <div id="edit-form">
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Product:</p>
          <select v-model="productPackagingForm.Product_ID" class="rounded-[6px] px-2 py-1 max-w-xs">
            <option v-for="product in products" :value="product.Product_ID" :key="product.Product_ID">{{
              product.Product_Name }}</option>
          </select>
        </div>
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Barcode:</p>
          <input v-model="productPackagingForm.Bar_Code" type="text" placeholder="Barcode"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
        </div>
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Unit Weight:</p>
          <input v-model="productPackagingForm.Unit_Weight" type="number" placeholder="Unit Weight"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
        </div>
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Unit Size: (mg,g,ml,l,etc)</p>
          <input v-model="productPackagingForm.Unit_Size" type="text" placeholder="Unit Size"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
        </div>
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Price:</p>
          <input v-model="productPackagingForm.Unit_Price" type="number" placeholder="Unit Price"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
        </div>
        <div class="text-xs pt-2 text-[#f00] text-wrap">{{ messages.edit }}</div>
      </div>
      <div class="modal-action">
        <button @click="saveProductPackaging(true)" class="btn shadow-md text-[#3f1e61] border-[#877cde] border-1 h-9">
          Save Info
        </button>
      </div>
    </div>
  </dialog>

  <!--Delete Product Packaging Modal-->
  <dialog id="deleteProductPackagingModal" class="modal">
    <div class="modal-box !max-w-[390px] p-5">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none">
        <p class="text-lg font-bold text-wrap">Do you really want to delete this product packaging?</p>
        <div class="mt-1 text-xs fton-bold bg-[#b07166] text-white w-min m-min px-2 py-1 rounded-[15px]">
          {{ productPackagingForm.Bar_Code }}
        </div>
        <div class="text-xs pt-2 text-[#f00]">{{ messages.delete }}</div>
        <p class="text-[11px] mt-5">This action cannot be reversed</p>
        <button @click="deleteProductPackaging()" class="mt-1 btn btn-error shadow-xs h-7">Delete</button>
      </div>
    </div>
  </dialog>
</template>
