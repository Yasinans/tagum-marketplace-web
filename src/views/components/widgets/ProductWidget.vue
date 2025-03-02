<script setup lang="ts">
import { computed, ref, reactive, onMounted } from "vue";
import axios from "axios";
import {
    PlusIcon,
    ArrowPathRoundedSquareIcon,
} from '@heroicons/vue/24/solid';

interface ProductData {
    id: number;
    name: string;
    supplierId: number;
    supplierName: string;
    brandId: number;
    brandName: string;
}

const selectedProductId = ref<number | null>(null);
const productSearch = ref("");
const productDatas = ref<ProductData[]>([]);
const messages = reactive({ edit: "", add: "", delete: "" });
const productForm = reactive({
  name: "",
  supplierId: null,
  brandId: null
});
const suppliers = ref<{ id: number, name: string }[]>([]);
const brands = ref<{ id: number, name: string }[]>([]);

const filteredProductDatas = computed(() =>

productDatas.value.filter(
    (e) =>
      e.name.toLowerCase().includes(productSearch.value.toLowerCase())
  )
);

const saveProduct = async (isEdit: boolean) => {
  if (!productForm.name || productForm.supplierId === null || productForm.brandId === null) {
    messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
    return;
  }
  const { name, supplierId, brandId } = productForm;
  try {
    if (isEdit) {
      await axios.put(`http://localhost:3000/api/product/${selectedProductId.value}`, { name, supplierId, brandId });
      (document.getElementById("editProductModal") as HTMLDialogElement).close();
    } else {
      await axios.post("http://localhost:3000/api/product", { name, supplierId, brandId });
      (document.getElementById("addProductModal") as HTMLDialogElement).close();
    }
    loadProduct();
  } catch (err) {
    messages[isEdit ? "edit" : "add"] = axios.isAxiosError(err) ? err.response?.data?.message || "Server error" : "Unexpected error.";
  }
};

const deleteProduct = async () => {
  if (!selectedProductId.value) return (messages.delete = "No product selected.");

  try {
    await axios.delete(`http://localhost:3000/api/product/${selectedProductId.value}`);
    (document.getElementById("deleteProductModal") as HTMLDialogElement).close();
    loadProduct();
  } catch (err) {
    messages.delete = axios.isAxiosError(err) ? err.response?.data?.message || "Server error" : "Unexpected error.";
  }
};

const loadProduct = async () => {
  try {
    const [productRes, supplierRes, brandRes] = await Promise.all([
      axios.get("http://localhost:3000/api/product"),
      axios.get("http://localhost:3000/api/supplier"),
      axios.get("http://localhost:3000/api/brand"),
    ]);

    productDatas.value = productRes.data.map((product: any) => {
      return {
        id: product.Product_ID,
        name: product?.Product_Name || "",
        supplierId: product?.Supplier_ID || null,
        supplierName: product?.Supplier_Name || "",
        brandId: product?.Brand_ID || null,
        brandName: product?.Brand_Name || "",
      };
    });

    suppliers.value = supplierRes.data.map((supplier: any) => ({
      id: supplier.Supplier_ID,
      name: supplier.Supplier_Name
    }));

    brands.value = brandRes.data.map((brand: any) => ({
      id: brand.Brand_ID,
      name: brand.Brand_Name
    }));

  } catch (err) {
    console.error("Error loading products:", err);
  }
};

const loadProductModal = (id: number, isEdit: boolean) => {
  selectedProductId.value = id;
  messages.edit = "";
  messages.add = "";
  messages.delete = "";

  const product = productDatas.value.find((e) => e.id === id);
  if (product && isEdit) {
    Object.assign(productForm, product);
  } else {
    Object.assign(productForm, product);
    if (id === 0) {
      Object.assign(productForm, {
        name: "",
        supplierId: null,
        brandId: null
      });
    }
  }
};

onMounted(loadProduct);

</script>

<template>
    <div class="tg-widget">
        <div class="tg-widget-h">
            <div>
                Products
            </div>
            <div class="flex">
                <label class="input text-[14px] text-black h-[32px] mr-2 grow bg-[#f7f2f2]">
                    <magnifying-glass-icon class="h-[20px] pr-1 " />
                    <input v-model="productSearch" type="search" class="grow" placeholder="Search Product Name">
                </label>
                <div @click="loadProduct()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
                    <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
                </div>
                <div @click="loadProductModal(0, false)" onclick="addProductModal.showModal()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Product">
                    <plus-icon class="tg-widget-btn-icon" />
                </div>
            </div>
        </div>
        <div class="tg-table-container">
            <table class="tg-table">
                <thead>
                    <tr>
                        <td>Product Name</td>
                        <td>Supplier</td>
                        <td>Brand</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in filteredProductDatas" :key="product.id">
                        <td>{{ product.name }}</td>
                        <td>{{ product.supplierName }}</td>
                        <td>{{ product.brandName }}</td>
                        <td>
                            <div class="flex gap-[10px] justify-start !pr-[20px] ">
                                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                                    onclick="editProductModal.showModal()" @click="loadProductModal(product.id, true)">
                                    Edit
                                </button>
                                <button onclick="deleteProductModal.showModal()"  @click="loadProductModal(product.id, false)"
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

    <!--Add Product Modal-->
    <dialog id="addProductModal" class="modal">
      <div class="modal-box !max-w-[300px]">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="leading-none mb-1">
          <p class="text-lg font-bold">Add Product Info</p>
        </div>
        <div id="edit-form">
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Product Name:</p>
            <input v-model="productForm.name" type="text" placeholder="Product Name"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Supplier:</p>
            <select v-model="productForm.supplierId" class="rounded-[6px] px-2 py-1 max-w-xs">
              <option v-for="supplier in suppliers" :value="supplier.id" :key="supplier.id">{{ supplier.name }}</option>
            </select>
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Brand:</p>
            <select v-model="productForm.brandId" class="rounded-[6px] px-2 py-1 max-w-xs">
              <option v-for="brand in brands" :value="brand.id" :key="brand.id">{{ brand.name }}</option>
            </select>
          </div>
          <div class="text-xs pt-2 text-[#f00] text-wrap">{{ messages.add }}</div>
        </div>
        <div class="modal-action">
          <button @click="saveProduct(false)" class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">
            Create Product</button>
        </div>
      </div>
    </dialog>

    <!--Edit Product Modal-->
    <dialog id="editProductModal" class="modal">
      <div class="modal-box !max-w-[300px]">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="leading-none mb-1">
          <p class="text-lg font-bold">Edit Product Info</p>
          <div class="flex items-center ">
            <p class="text-[11px]">for</p>
            <div class="text-[10px] ml-[5px] bg-[#b07166] text-white w-min m-min px-1 py-1 rounded-[15px]">
              {{productForm.name}}
            </div>
          </div>
        </div>
        <div id="edit-form">
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Product Name:</p>
            <input v-model="productForm.name" type="text" placeholder="Product Name"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Supplier:</p>
            <select v-model="productForm.supplierId" class="rounded-[6px] px-2 py-1 max-w-xs">
              <option v-for="supplier in suppliers" :value="supplier.id" :key="supplier.id">{{ supplier.name }}</option>
            </select>
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Brand:</p>
            <select v-model="productForm.brandId" class="rounded-[6px] px-2 py-1 max-w-xs">
              <option v-for="brand in brands" :value="brand.id" :key="brand.id">{{ brand.name }}</option>
            </select>
          </div>
          <div class="text-xs pt-2 text-[#f00] text-wrap">{{ messages.edit }}</div>
        </div>
        <div class="modal-action">
          <button @click="saveProduct(true)" class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">Save
            Info</button>
        </div>
      </div>
    </dialog>

    <!--Delete Product Modal-->
    <dialog id="deleteProductModal" class="modal">
      <div class="modal-box !max-w-[390px] p-5">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="leading-none">
          <p class="text-lg font-bold">Do you really want to delete this product?</p>
          <div class="mt-1 text-xs fton-bold bg-[#b07166] text-white w-min m-min px-2 py-1 rounded-[15px]">
            {{productForm.name}}
          </div>
          <div class="text-xs pt-2 text-[#f00]">{{ messages.delete }}</div>
          <p class="text-[11px] mt-5">This action cannot be reversed</p>
          <button @click="deleteProduct()" class="mt-1 btn btn-error shadow-xs h-7">Delete</button>
        </div>

      </div>
    </dialog>
</template>

