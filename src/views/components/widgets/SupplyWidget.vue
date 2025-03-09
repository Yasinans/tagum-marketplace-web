<script setup lang="ts">
import { useProductVariant } from "../../../composable/useProductVariant";
import { useSupply } from "../../../composable/useSupply";
import { useSupplyDetail } from "../../../composable/useSupplyDetail";
import { useSupplier } from "../../../composable/useSupplier";
import { useRemark } from "../../../composable/useRemark";
import { useStockOutSupply } from "../../../composable/useStockOutSupply";
import {
  ArrowPathRoundedSquareIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/solid';

const {
  supplierDatas,
  loadSupplier
} = useSupplier();

const {
  productVariantSearch,
  filteredProductVariantDatas,
  loadProductVariant
} = useProductVariant();

const {
  resetSupplyForm,
  filteredSupplyDatas,
  supplySearch,
  selectedSupplyId,
  messages: supplyMessages,
  deleteSupply,
  supplyForm,
  saveSupply,
  loadSupply
} = useSupply();

const {
  supplyDetailSearch,
  selectedSupplyDetailId,
  filteredSupplyDetailDatas,
  messages: supplyDetailMessages,
  loadSupplyDetail,
  deleteSupplyDetail,
  saveSupplyDetail,
  supplyDetailForm
} = useSupplyDetail();

const {
  saveStockOutSupply,
  messages: stockOutSupplyMessages,
  stockOutSupplies,
  loadStockOutSupplies,
  stockOutSupplyForm
} = useStockOutSupply();

const reloadData: () => void = () => {
  loadProductVariant();
  loadSupplier();
  loadSupply();
  loadStockOutSupplies();
  loadSupplyDetail();
}
const {
  remarkDatas
} = useRemark();

const getStockOutRemark = (id: number) => {
  let stockOut = stockOutSupplies.value.find(stockOut => stockOut.SupplyDetail_ID === id)
  if(!stockOut) return "Active"
  else {
    return remarkDatas.value.find(remark => remark.Remarks_ID === stockOut.Remarks_ID)?.Remarks
  }
}
</script>
<template>
  <div class="tg-widget">
    <div class="tg-widget-h">
      <div>Supplies</div>
      <div class="flex">
        <label class="input text-[14px] text-black h-[32px] mr-2 grow bg-[#f7f2f2]">
          <magnifying-glass-icon class="h-[20px] pr-1 " />
          <input v-model="supplySearch.name" type="search" class="grow" placeholder="Search Supplier Name">
        </label>
        <div @click="reloadData()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
          <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
        </div>
        <div @click="
            supplyMessages.add='';resetSupplyForm()" onclick="addSupplyModal.showModal()"
          class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Supply">
          <plus-icon class="tg-widget-btn-icon" />
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
          <tr v-for="supply in filteredSupplyDatas" :key="supply.Supply_ID">
            <td>{{ supply.Supply_ID }}</td>
            <td>{{ supply.Supplier_Name }}</td>
            <td>{{ supply.Employee_Name }}</td>
            <td>{{ new Date(supply.Supply_date).toLocaleString() }}</td>
            <td>
              <div class="flex gap-[10px] justify-start !pr-[20px] ">
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="viewSupplyDetailsModal.showModal()" @click="
                  selectedSupplyId = supply.Supply_ID;
                  supplyDetailForm.Supply_ID = supply.Supply_ID;
                  supplyDetailSearch.Supply_ID = supply.Supply_ID;
                  reloadData()
                  ">
                  View Details
                </button>
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="editSupplyModal.showModal()" @click="
                    supplyMessages.add='';
                    selectedSupplyId = supply.Supply_ID;
                    supplyForm = { ...supply };
                    ">
                  Edit
                </button>
                <button onclick="deleteSupplyModal.showModal()" @click="
                  supplyMessages.delete='';
                  selectedSupplyId = supply.Supply_ID
                  " class="btn h-[25px] p-[12px] shadow-md bg-[#fc5861] border-none">
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

          <input v-model="productVariantSearch" type="search" class="input join-item"
            placeholder="Search Product Name" />
          <label class="select mr-3">
            <select v-model="supplyDetailForm.Bar_Code" class="select join-item" required>
              <option v-if="filteredProductVariantDatas.length === 0" value="" disabled>No Existing Products</option>
              <option v-for="product in filteredProductVariantDatas" :value="product.Bar_Code">
                {{ product.Product_Name }} {{ Math.round(product.Unit_Weight * 100) / 100 }}{{ product.Unit_Size }}
              </option>
            </select>
          </label>
          <button class="btn join-item" @click="
          saveSupplyDetail(false);
          supplyDetailForm.Supply_ID = selectedSupplyId;
          ">Add</button>
        </div>
        <div class="join w-full">
          <label class="input mr-2">
            <span class="label">Quantity</span>
            <input v-model="supplyDetailForm.Quantity" type="number" class="input join-item" placeholder="Quantity" required/>
          </label>
          <label class="input mr-2">
            <span class="label">Unit Price</span>
            <input v-model="supplyDetailForm.Unit_Price" type="number" class="input join-item"
              placeholder="Unit Price" required/>
          </label>
          <label class="input">
            <span class="label">Expiry Date</span>
            <input v-model="supplyDetailForm.Expiry" type="date" class="input join-item" placeholder="Calendar" required/>
          </label>
        </div>
        <div class="text-xs pt-2 text-[#f00] text-wrap">{{ supplyDetailMessages.add }}</div>

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
              <div class="font-semibold flex items-center gap-2 mb-1">
                <div>{{ supplyDetail.Bar_Code }} </div>
                <div class="badge badge-outline badge-neutral">x {{ supplyDetail.Quantity }}</div>

                <span
                  class="badge"
                  :class="{'badge-success': getStockOutRemark(supplyDetail.SupplyDetail_ID) === 'Active', 'badge-error': getStockOutRemark(supplyDetail.SupplyDetail_ID) !== 'Active'}"
                >
                {{
                 getStockOutRemark(supplyDetail.SupplyDetail_ID)
                }}
                </span>
              </div>
              <div class="text-xs uppercase font-semibold opacity-60">
                Unit Price: ₱{{ supplyDetail.Unit_Price }} | Expiry: {{ new
                  Date(supplyDetail.Expiry).toLocaleDateString() }} | SubTotal:
                ₱{{ supplyDetail.Subtotal }}
              </div>
            </div>
            <button
              @click="selectedSupplyDetailId = supplyDetail.SupplyDetail_ID;"
              onclick="deleteSupplyDetailModal.showModal()" class="btn btn-ghost border-gray-300">
              Delete
            </button>
            <button v-if="!stockOutSupplies.some(s => s.SupplyDetail_ID === supplyDetail.SupplyDetail_ID)"
              @click=" stockOutSupplyForm.SupplyDetail_ID = supplyDetail.SupplyDetail_ID"
              onclick="removeSupplyDetailModal.showModal()" class="btn btn-ghost border-gray-300">
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
          <select v-model="stockOutSupplyForm.Remarks_ID" class="rounded-[6px] px-2 py-1 max-w-xs">
            <option v-for="remark in remarkDatas" :value="remark.Remarks_ID" :key="remark.Remarks_ID">{{ remark.Remarks }}
            </option>
          </select>
        </div>
        <div class="text-xs pt-2 text-[#f00] text-wrap">{{ stockOutSupplyMessages.add }}</div>
      </div>
      <div class="modal-action">
        <button @click="saveStockOutSupply(false)" class="btn shadow-md text-[#3f1e61] border-[#877cde] border-1 h-9">
          Stock Out
        </button>
      </div>
    </div>
  </dialog>
  <!--Delete Supply Detail - FOR ADMIN ONLY :)-->
  <dialog id="deleteSupplyDetailModal" class="modal">
    <div class="modal-box !max-w-[390px] p-5">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none">
        <p class="text-lg font-bold text-wrap">Do you really want to delete this from the supply?</p>
        <div class="text-xs pt-2 text-[#f00]">{{ supplyDetailMessages.delete }}</div>
        <p class="text-[11px] mt-5">This action cannot be reversed</p>
        <button @click="deleteSupplyDetail()" class="mt-1 btn btn-error shadow-xs h-7">Delete</button>
      </div>

    </div>
  </dialog>
  <!--Add Supply Modal-->
  <dialog id="addSupplyModal" class="modal">
    <div class="modal-box !max-w-[300px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">Add Supply Info</p>
      </div>
      <div id="edit-form">
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Supplier:</p>
          <select v-model="supplyForm.Supplier_id" class="rounded-[6px] px-2 py-1 max-w-xs">
            <option v-if="supplierDatas.length === 0" value="" disabled>No Existing Suppliers</option>
            <option v-else v-for="supplier in supplierDatas" :value="supplier.id" :key="supplier.id">{{ supplier.name }}</option>
          </select>
        </div>
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Expiry Date:</p>
          <input v-model="supplyForm.Supply_date" type="date" placeholder="Full Name"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
        </div>
        <div class="text-xs pt-2 text-[#f00] text-wrap">{{ supplyMessages.add }}</div>
      </div>
      <div class="modal-action">
        <button @click="saveSupply(false)" class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">
          Create Supply
        </button>
      </div>
    </div>
  </dialog>
  <!--Edit Supply Modal-->
  <dialog id="editSupplyModal" class="modal">
    <div class="modal-box !max-w-[300px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">Edit Supply Info</p>
        <div class="flex items-center">
          <p class="text-[11px]">for Supply No. </p>
          <div class="text-[10px] ml-[5px] bg-[#b07166] text-white w-min m-min px-1 py-1 rounded-[15px]">
            {{ supplyForm.Supply_ID }}
          </div>
        </div>
      </div>
      <div id="edit-form">
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Supplier:</p>
          <select v-model="supplyForm.Supply_ID" class="rounded-[6px] px-2 py-1 max-w-xs">
            <option v-for="supplier in supplierDatas" :value="supplier.id" :key="supplier.id">{{ supplier.name }}
            </option>
          </select>
        </div>
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Expiry Date:</p>
          <input v-model="supplyForm.Supply_date" type="date" placeholder="Full Name"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
        </div>
        <div class="text-xs pt-2 text-[#f00] text-wrap">{{ supplyMessages.add }}</div>
      </div>
      <div class="modal-action">
        <button @click="saveSupply(true)" class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">
          Edit Supply</button>
      </div>
    </div>
  </dialog>
  <!--Delete Supply Modal-->
  <dialog id="deleteSupplyModal" class="modal">
    <div class="modal-box !max-w-[390px] p-5">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none">
        <p class="text-lg font-bold text-wrap">Do you really want to delete this supply?</p>
        <div class="mt-1 text-xs fton-bold bg-[#b07166] text-white w-min m-min px-2 py-1 rounded-[15px]">
          {{ selectedSupplyId }}
        </div>
        <div class="text-xs pt-2 text-[#f00]">{{ supplyMessages.delete }}</div>
        <p class="text-[11px] mt-5">This action cannot be reversed</p>
        <button @click="deleteSupply()" class="mt-1 btn btn-error shadow-xs h-7">Delete</button>
      </div>
    </div>
  </dialog>
</template>
