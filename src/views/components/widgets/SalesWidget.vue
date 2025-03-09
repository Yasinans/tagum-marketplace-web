<script setup lang="ts">
import {
  PlusIcon,
  ArrowPathRoundedSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/solid";

import { useSale } from "../../../composable/useSale";
import { useCustomer } from "../../../composable/useCustomer";
import { useProductVariant } from "../../../composable/useProductVariant";
import { useSaleDetail } from "../../../composable/useSaleDetail";
import { ref, computed } from "vue";
const {
  selectedSaleId,
  saleSearch,
  saleDatas,
  filteredSaleDatas,
  messages: saleMessages,
  saleForm,
  loadSale,
  saveSale,
  deleteSale,
} = useSale();

const {
  productVariantDatas,
  filteredProductVariantDatas,
  loadProductVariant,
  selectedProductVariantId,
  productVariantSearch,
} = useProductVariant();

const {
  saleDetailForm,
  resetSaleDetailForm,
  addSaveDetails,
  saleDetailDatas,
  deleteSaleDetail,
  saleDetailSearch,
  filteredSaleDetailDatas,
} = useSaleDetail();

const {
  selectedCustomerId,
  filteredCustomerDatas,
  customerSearch,
  customerForm,
  saveCustomer,
  resetCustomerForm,
} = useCustomer();

/*Exclusive for SalesWidget :)*/
interface SaleDetailData {
  barCode: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}
interface SaleDetailCreate {
  barCode: string;
  unitPrice: number;
  quantity: number;
}

const orderDetails = ref<SaleDetailData[]>([]);

const addToOrderDetails = () => {
  const existingOrder = orderDetails.value.find(
    (e) => e.barCode === selectedProductVariantId.value
  );
  if (existingOrder) {
    existingOrder.quantity += saleDetailForm.value.quantity;
  } else {
    orderDetails.value.push({
      barCode: selectedProductVariantId.value ?? "",
      unitPrice:
        productVariantDatas.value.find(
          (e) => e.Bar_Code === selectedProductVariantId.value
        )?.Unit_Price || 0,
      productName:
        productVariantDatas.value.find(
          (e) => e.Bar_Code === selectedProductVariantId.value
        )?.Product_Name || "",
      quantity: saleDetailForm.value.quantity,
    });
  }
  resetSaleDetailForm();
};

const processSale = async () => {
  const saleDetailCreates: SaleDetailCreate[] = orderDetails.value.map(
    (detail) => ({
      barCode: detail.barCode,
      unitPrice: detail.unitPrice,
      quantity: detail.quantity,
    })
  );
  if (saleDetailCreates.length === 0) {
    saleMessages.add = "There must be atleast one sale detail.";
    return;
  }
  if (selectedCustomerId.value == -1) {
    selectedCustomerId.value = await saveCustomer(false);
  }
  saleForm.customerId = selectedCustomerId.value;
  const id = await saveSale(false);
  addSaveDetails(id, saleDetailCreates);
  orderDetails.value = [];
  resetSaleDetailForm();
  resetCustomerForm();
  selectedCustomerId.value = 0;
  selectedProductVariantId.value = "";
};

function getTotalAmount(saleId: number) {
  const sale = saleDatas.value.find((sale) => sale.id === saleId);
  if (!sale) return 0;
  const saleDetails = saleDetailDatas.value.filter(
    (saleDetail) => saleDetail.saleId === saleId
  );
  return saleDetails.reduce(
    (total, saleDetail) => total + saleDetail.subTotal,
    0
  );
}
const isNewCustomer = computed(() => selectedCustomerId.value === -1);
</script>

<template>
  <div class="tg-widget w-[100%]">
    <div class="tg-widget-h">
      <div>Sales</div>
      <div class="flex">
        <label class="input text-[14px] text-black h-[32px] min-w-[250px] mr-2 grow bg-[#f7f2f2]">
          <magnifying-glass-icon class="h-[20px] pr-1" />
          <input v-model="saleSearch" type="search" class="grow" placeholder="Search Sale By Customer Name" />
        </label>
        <div @click="loadSale()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
          <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
        </div>
        <div onclick="addSaleModal.showModal()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Sale">
          <plus-icon class="tg-widget-btn-icon" />
        </div>
      </div>
    </div>
    <div class="tg-table-container">
      <table class="tg-table">
        <thead>
          <tr>
            <td>Sales #</td>
            <td>Customer Name</td>
            <td>Cashier</td>
            <td>Sales Date</td>
            <td>Total Amount</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in filteredSaleDatas" :key="sale.id">
            <td>{{ sale.id }}</td>
            <td>{{ sale.customerName || "N/A" }}</td>
            <td>{{ sale.employeeName }}</td>
            <td>{{ new Date(sale.date).toLocaleString() }}</td>
            <td>₱{{ getTotalAmount(sale.id) }}</td>
            <td>
              <div class="flex gap-[10px] justify-start !pr-[20px]">
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="viewSaleDetails.showModal()" @click="saleDetailSearch = sale.id">
                  View Order Details
                </button>
                <button @click="selectedSaleId = sale.id" onclick="deleteSaleModal.showModal()"
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

  <!--Add Sale Modal-->
  <dialog id="addSaleModal" class="modal">
    <div class="modal-box !max-w-[700px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">Create Sale</p>
      </div>
      <div id="edit-form">
        <fieldset class="fieldset bg-base-200 border border-base-300 p-4 rounded-box">
          <!--For Customer Details-->
          <legend class="fieldset-legend">Customer Details</legend>
          <fieldset class="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box join">
            <legend class="fieldset-legend">Existing Customer</legend>
            <input type="text" v-model="customerSearch" class="input w-full" placeholder="Search Customer Name"
              required />
            <select class="select select-bordered w-full" v-model="selectedCustomerId">
              <option :value="-1" selected>New Customer</option>
              <option v-for="customer in filteredCustomerDatas" :key="customer.id" :value="customer.id">
                {{ customer.name }} - {{ customer.address }}
              </option>
            </select>
          </fieldset>
          <fieldset class="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box"
            :class="{ hidden: !isNewCustomer }">
            <legend class="fieldset-legend">New Customer</legend>
            <label class="fieldset-label">Customer Name</label>
            <input type="text" class="input" v-model="customerForm.name" placeholder="Customer Name" required />
            <label class="fieldset-label">Customer Address</label>
            <input type="text" class="input" v-model="customerForm.address" placeholder="Customer Address" />
            <label class="fieldset-label">Customer Contact No.</label>
            <input type="text" class="input" v-model="customerForm.phone" placeholder="Contact No." />
          </fieldset>
          <!--End Customer Details-->
        </fieldset>
        <!--For Product Details-->
        <fieldset class="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box">
          <legend class="fieldset-legend">Add Products</legend>
          <div class="join">
            <input type="text" v-model="productVariantSearch" class="input mr-3"
              placeholder="Search Product Name or Barcode" required />
            <select class="select select-bordered" v-model="selectedProductVariantId">
              <option v-for="product in filteredProductVariantDatas" :key="product.Bar_Code" :value="product.Bar_Code">
                {{ product.Bar_Code }} - {{ product.Product_Name }}
                {{ product.Unit_Weight }}{{ product.Unit_Size }}
              </option>
            </select>
          </div>
          <div class="join">
            <div class="w-full mr-3">
              <label class="fieldset-label">Quantity</label>
              <input v-model="saleDetailForm.quantity" type="number" class="input" :min="1" placeholder="Quantity" />
            </div>
            <div class="w-full">
              <p>
                Subtotal:
                {{
                  (productVariantDatas.find(
                    (e) => e.Bar_Code === selectedProductVariantId
                  )?.Unit_Price || 0) * saleDetailForm.quantity
                }}
              </p>
              <button @click="addToOrderDetails()" class="btn rounded-[13px]"
                v-bind:class="{ hidden: !selectedProductVariantId }">
                Add
              </button>
            </div>
          </div>
        </fieldset>
        <!--list of order-->
        <!--list-->
        <div>
          <ul class="list bg-base-100 rounded-box shadow-md mt-5">
            <li v-for="order in orderDetails" :key="order.barCode" class="list-row">
              <div class="pr-5 border-r border-gray-300">
                <div>Bar Code</div>
                <div class="text-xs uppercase font-semibold opacity-60">
                  {{ order.barCode }}
                </div>
              </div>
              <div>
                <div class="font-semibold">{{ order.productName }}</div>
                <div class="text-xs uppercase font-semibold opacity-60">
                  QUANTITY: {{ order.quantity }} PCS, SUBTOTAL: ₱{{
                    order.unitPrice * order.quantity
                  }}
                </div>
              </div>
              <button @click="
                orderDetails = orderDetails.filter(
                  (o) => o.barCode !== order.barCode
                )
                " class="btn btn-ghost border-gray-300">
                Remove
              </button>
            </li>
          </ul>
        </div>
        <div class="text-xs pt-2 text-[#f00] text-wrap">
          {{ saleMessages.add }}
        </div>

        <div class="modal-action">
          <button @click="processSale()" class="btn shadow-md text-[#3f1e61] border-[#877cde] border-1 h-9">
            Add Sale
          </button>
        </div>
      </div>
    </div>
  </dialog>

  <!--Edit Sale Modal-->
  <dialog id="viewSaleDetails" class="modal">
    <div class="modal-box !max-w-[700px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">View Sale Details</p>
      </div>
      <div id="edit-form">
        <!--list of order-->
        <div>
          <ul class="list bg-base-100 rounded-box shadow-md mt-5">
            <li v-for="order in filteredSaleDetailDatas" :key="order.barCode" class="list-row">
              <div class="pr-5 border-r border-gray-300">
                <div>Bar Code</div>
                <div class="text-xs uppercase font-semibold opacity-60">
                  {{ order.barCode }}
                </div>
              </div>
              <div>
                <div class="font-semibold">
                  {{
                    productVariantDatas.find(
                      (e) => e.Bar_Code === order.barCode
                    )?.Product_Name
                  }}
                </div>
                <div class="text-xs uppercase font-semibold opacity-60">
                  QUANTITY: {{ order.quantity }} PCS, SUBTOTAL: ₱{{
                    order.unitPrice * order.quantity
                  }}
                </div>
              </div>
              <button @click="deleteSaleDetail(order.barCode, order.saleId)" class="btn btn-ghost border-gray-300">
                Remove
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </dialog>
  <!--Delete Sale Modal-->
  <dialog id="deleteSaleModal" class="modal">
    <div class="modal-box !max-w-[390px] p-5">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="leading-none">
        <p class="text-lg font-bold">Do you really want to delete this sale?</p>
        <div class="mt-1 text-xs fton-bold bg-[#b07166] text-white w-min m-min px-2 py-1 rounded-[15px]">
          {{ selectedSaleId }}
        </div>
        <div class="text-xs pt-2 text-[#f00]">{{ saleMessages.delete }}</div>
        <p class="text-[11px] mt-5">This action cannot be reversed</p>
        <button @click="deleteSale()" class="mt-1 btn btn-error shadow-xs h-7">
          Delete
        </button>
      </div>
    </div>
  </dialog>
</template>
