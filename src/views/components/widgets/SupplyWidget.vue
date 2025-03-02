<script setup lang="ts">
import { computed, ref, reactive, onMounted } from "vue";
import axios from "axios";
import {
  ArrowPathRoundedSquareIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/solid';


//for productpack
interface ProductPackagingData {
  Product_Name: string;
  Bar_Code: string;
  Product_ID: number;
  Unit_Weight: number;
  Unit_Size: string;
  Unit_Price: number;
}
const selectedProductPackagingId = ref<string | null>(null);
const productPackagingSearch = ref("");
const productPackagingDatas = ref<ProductPackagingData[]>([]);
const filteredProductPackagingDatas = computed(() =>
  productPackagingDatas.value.filter(
    (e) =>
      e.Product_Name.toLowerCase().includes(productPackagingSearch.value.toLowerCase()) ||
      e.Bar_Code.toLowerCase().includes(productPackagingSearch.value.toLowerCase())
  )
);
const loadProductPackaging = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/productpackaging");
    productPackagingDatas.value = res.data;
  } catch (err) {
    console.error("Error loading product packagings:", err);
  }
};
//load when opened
//supply
interface SupplyData {
  Supply_ID: number;
  Supplier_id: number;
  Employee_id: number;
  supply_date: string;
  Supplier_Name: string;
  Employee_Name: string;
}

interface SupplyDetailData {
  SupplyDetail_ID: number;
  Supply_ID: number;
  Quantity: number;
  Bar_Code: string;
  Unit_Price: string;
  Expiry: string;
  Subtotal: string;
}

const supplyDatas = ref<SupplyData[]>([]);
const supplyDetailDatas = ref<SupplyDetailData[]>([]);
const selectedSupplyId = ref<number | null>(null);
const filteredSupplyDetailDatas = computed(() =>
  supplyDetailDatas.value.filter(
    (e) =>
      !selectedSupplyId.value ||
      e.Supply_ID === selectedSupplyId.value
  )
);

const loadSupply = async () => {
  try {
    const res = await axios.get<SupplyData[]>("http://localhost:3000/api/supply");
    supplyDatas.value = res.data;
  } catch (err) {
    console.error("Error loading supply:", err);
  }
};

const loadSupplyDetails = async () => {
  try {
    const res = await axios.get<SupplyDetailData[]>("http://localhost:3000/api/supplydetails");
    supplyDetailDatas.value = res.data;
  } catch (err) {
    console.error("Error loading supply details:", err);
  }
};

const selectedSupplyDetailId = ref<number | null>(null);
const messages = reactive({ edit: "", add: "", delete: "" });

const deleteSupplyDetail = async () => {
  if (!selectedSupplyDetailId.value) {
    messages.delete = "No supply detail selected.";
    return;
  }
  try {
    await axios.delete(`http://localhost:3000/api/supplydetails/${selectedSupplyDetailId.value}`);
    refreshData();
    (document.getElementById("deleteSupplyDetailModal") as HTMLDialogElement).close();
  } catch (err) {
    messages.delete = axios.isAxiosError(err) ? err.response?.data?.message || "Server error" : "Unexpected error.";
  }
};

const saveSupplyDetail = async (isEdit: boolean) => {
  if (!selectedSupplyId.value || !supplyDetailForm.barCode || !supplyDetailForm.quantity || !supplyDetailForm.unitPrice || !supplyDetailForm.expiry) {
    messages.edit = "Please fill in all fields.";
    console.log(1);

    return;
  }
  try {
    if (isEdit) {
      await axios.put(`http://localhost:3000/api/supplydetails/${selectedSupplyDetailId.value}`, {
        supplyDetailId: selectedSupplyDetailId.value,
        quantity: supplyDetailForm.quantity,
        unitPrice: supplyDetailForm.unitPrice,
        expiry: supplyDetailForm.expiry
      });
    } else {
      await axios.post("http://localhost:3000/api/supplydetails", {
        supplyId: selectedSupplyId.value,
        barCode: supplyDetailForm.barCode,
        quantity: supplyDetailForm.quantity,
        unitPrice: supplyDetailForm.unitPrice,
        expiry: supplyDetailForm.expiry
      });
    }
    refreshData();
  } catch (err) {
    messages.edit = axios.isAxiosError(err) ? err.response?.data?.message || "Server error" : "Unexpected error.";
  }
};

const supplyDetailForm = reactive({
  supplyDetailId: null,
  supplyId: 0,
  barCode: "",
  quantity: 0,
  unitPrice: 0,
  expiry: "",
});

const loadSupplyDetailsModal = (id: number) => {
  selectedSupplyId.value = id;
};

const selectedRemoveRemarksId = ref<number | null>(null);

const remarks = ref<{ Remarks_ID: number, Remarks: string }[]>([]);

const loadRemarks = async () => {
  try {
    const response = await axios.get<{ Remarks_ID: number, Remarks: string }[]>("http://localhost:3000/api/remarks");
    remarks.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

//to be deleted
const employeeId = ref('');
const updateEmployeeId = () => {
    const token = localStorage.getItem("token") || "";
    const payload = JSON.parse(atob(token.split('.')[1]));
    return employeeId.value = payload.id
}
updateEmployeeId();
//

const removeSupplyDetail = async () => {
  if (!selectedSupplyDetailId) return (messages.delete = "No supply detail selected.");
  try {
    await axios.post(`http://localhost:3000/api/stockout/`, 
        { supplyDetailId: selectedSupplyDetailId.value, 
          employeeId: employeeId.value, 
          remarksId: selectedRemoveRemarksId.value });
    refreshData();
    (document.getElementById("removeSupplyDetailModal") as HTMLDialogElement).close();
  } catch (err) {
    messages.delete = axios.isAxiosError(err) ? err.response?.data?.message || "Server error" : "Unexpected error.";
  }
};

const refreshData = async () => {
  loadRemarks();
  loadSupply();
  loadSupplyDetails();
}
onMounted(() => {
  refreshData();
});
</script>
<template>
  <div class="tg-widget">
    <div class="tg-widget-h">
      <div>Supplies</div>
      <div class="flex">
        <label class="input text-[14px] text-black h-[32px] mr-2 grow bg-[#f7f2f2]">
          <magnifying-glass-icon class="h-[20px] pr-1 " />
          <input type="search" class="grow" placeholder="Search Supplier Name">
        </label>
        <div @click="loadSupplyDetails()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
          <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
        </div>
      </div>
    </div>
    <div class="tg-table-container">
      <table class="tg-table">
        <thead>
          <tr>
            <td>Supply #</td>
            <td>Supplier</td>
            <td>Handled By</td>
            <td>Supply Date</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="supply in supplyDatas" :key="supply.Supply_ID">
            <td>{{ supply.Supply_ID }}</td>
            <td>{{ supply.Supplier_Name }}</td>
            <td>{{ supply.Employee_Name }}</td>
            <td>{{ new Date(supply.supply_date).toLocaleString() }}</td>
            <td>
              <div class="flex gap-[10px] justify-start !pr-[20px] ">
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="viewSupplyDetailsModal.showModal()"
                  @click="loadSupplyDetailsModal(supply.Supply_ID); loadProductPackaging();">
                  View Details
                </button>
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="editProductPackagingModal.showModal()" @click="">
                  Edit
                </button>
                <button onclick="deleteSupplyDetailModal.showModal()" @click=""
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
  <!--View Supply Details Modal-->
  <dialog id="viewSupplyDetailsModal" class="modal">
    <div class="modal-box !max-w-[800px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">View Supply Details</p>
        <div class="flex items-center ">
          <p class="text-[11px]">for Supply #</p>
          <div class="text-[10px] ml-[5px] bg-[#b07166] text-white w-min m-min px-1 py-1 rounded-[15px]">
            {{ selectedSupplyId }}
          </div>
        </div>
      </div>
      <fieldset class="fieldset bg-base-200 border border-base-300 p-4 rounded-box">
        <div class="join w-full">
          
          <input v-model="supplyDetailForm.barCode" type="search" class="input join-item" placeholder="Search Product Name or Barcode" />
          <label class="select mr-3">
            <select v-model="supplyDetailForm.barCode" class="select join-item">
              <option v-for="product in filteredProductPackagingDatas" :value="product.Bar_Code">
                {{ product.Product_Name }} {{ Math.round(product.Unit_Weight * 100) / 100 }}{{ product.Unit_Size }}
              </option>
            </select>
          </label>
          <button class="btn join-item" @click="saveSupplyDetail(false)">Add</button>
        </div>
        <div class="join w-full">
          <label class="input mr-2">
            <span class="label">Quantity</span>
            <input v-model="supplyDetailForm.quantity" type="number" class="input join-item" placeholder="Quantity" />
          </label>
          <label class="input mr-2">
            <span class="label">Unit Price</span>
            <input v-model="supplyDetailForm.unitPrice" type="number" class="input join-item" placeholder="Unit Price" />
          </label>
          <label class="input">
            <span class="label">Expiry Date</span>
            <input v-model="supplyDetailForm.expiry" type="date" class="input join-item" placeholder="Calendar" />
          </label>
        </div>
        <div class="text-xs pt-2 text-[#f00] text-wrap">{{ messages.add }}</div>

      </fieldset>
      <!--list-->
      <div>
        <ul class="list bg-base-100 rounded-box shadow-md mt-5">
          <li v-for="supplyDetail in filteredSupplyDetailDatas" :key="supplyDetail.SupplyDetail_ID" class="list-row">
            <div class="pr-5 border-r border-gray-300">
              <div>Supply Detail #</div>
              <div class="text-xs uppercase font-semibold opacity-60">{{ supplyDetail.SupplyDetail_ID }}</div>
            </div>
            <div>
              <div class="font-semibold">{{ supplyDetail.Bar_Code }}</div>
              <div class="text-xs uppercase font-semibold opacity-60">
                Unit Price: {{ supplyDetail.Unit_Price }} | Expiry: {{ new Date(supplyDetail.Expiry).toLocaleDateString() }} | Quantity: {{ supplyDetail.Quantity }} | SubTotal: ₱{{ supplyDetail.Subtotal }}
              </div>
            </div>
            <button @click="selectedSupplyId = supplyDetail.Supply_ID; selectedSupplyDetailId = supplyDetail.SupplyDetail_ID" onclick="deleteSupplyDetailModal.showModal()" class="btn btn-ghost border-gray-300">
              Delete
            </button>
            <button @click="selectedSupplyId = supplyDetail.Supply_ID; selectedSupplyDetailId = supplyDetail.SupplyDetail_ID" onclick="removeSupplyDetailModal.showModal()" class="btn btn-ghost border-gray-300">
              Remove
            </button>
          </li>
        </ul>
      </div>
    </div>
  </dialog>

  <!--Remove Supply Detail Modal-->
  <dialog id="removeSupplyDetailModal" class="modal">
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
   <!--Edit Supply Modal-->
   
  <!--Delete Supply Detail - FOR ADMIN ONLY :)-->
  <dialog id="deleteSupplyDetailModal" class="modal">
      <div class="modal-box !max-w-[390px] p-5">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="leading-none">
          <p class="text-lg font-bold text-wrap">Do you really want to delete this from the supply?</p>
          <div class="text-xs pt-2 text-[#f00]">{{ messages.delete }}</div>
          <p class="text-[11px] mt-5">This action cannot be reversed</p>
          <button @click="deleteSupplyDetail()" class="mt-1 btn btn-error shadow-xs h-7">Delete</button>
        </div>

      </div>
    </dialog>
</template>
