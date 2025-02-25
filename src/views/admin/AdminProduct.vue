<script setup lang="ts">
import {
  CalendarDateRangeIcon,
  PlusIcon,
  ArrowPathRoundedSquareIcon,
  ListBulletIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/solid';
</script>

<template>
  <main class="flex text-nowrap flex-col gap-[16px] p-[26px]">
    <div class="font-med text-[18px] text-white tracking-tighter">Product & Inventory</div>
    <!--Sections-->
    <div class="flex flex-wrap justify-start gap-[20px]">
      <!--Main Section - Product-->
      <div class="tg-widget w-[100%]">
        <div class="tg-widget-h">
          <div>
            Products
          </div>
          <div class="flex">
            <label class="input text-[14px] text-black h-[32px] mr-2 grow bg-[#f7f2f2]">
              <magnifying-glass-icon class="h-[20px] pr-1 " />
              <input type="search" class="grow" placeholder="Search Product Name">
            </label>
            <div class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
              <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
            </div>
            <div class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Brand">
              <plus-icon class="tg-widget-btn-icon" />
            </div>
          </div>
        </div>
        <div class="tg-table-container">
          <table class="tg-table">
            <thead>
              <tr>
                <td>Product</td>
                <td>Barcode</td>
                <td>Packaging</td>
                <td>Quantity</td>
                <td>Unit Price</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bear Brand Gatas</td>
                <td>9319239123J</td>
                <td>12x33g</td>
                <td>100</td>
                <td>PHP 100,000.00</td>
                <td>
                  <div class="flex gap-[10px] justify-start !pr-[20px] ">
                    <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none">
                      View Supplies
                    </button>
                    <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none">
                      Edit
                    </button>
                    <button class="btn h-[25px] p-[12px] shadow-md bg-[#fc5861] border-none">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

       <!--Main Section - Stocks-->
       <div class="tg-widget w-[100%]">
        <div class="tg-widget-h">
          <div>
            Supplies
          </div>
          <div class="flex">
            <label class="input text-[14px] text-black h-[32px] mr-2 grow bg-[#f7f2f2]">
              <magnifying-glass-icon class="h-[20px] pr-1 " />
              <input type="search" class="grow" placeholder="Search Supplier">
            </label>
            <div class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
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
                <td>Supply Date</td>
                <td>Total Products</td>
                <td>Supply Status</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bear Brand Gatas</td>
                <td>Michael Supplies</td>
                <td>July 9, 1998</td>
                <td>100</td>
                <td>
                  <div class="text-xs bg-[#6671b0] text-white w-min m-min px-2 py-1 rounded-[15px]">
                    Good
                  </div>
                </td>
                <td>
                  <div class="flex gap-[10px] justify-start !pr-[20px] ">
                    <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none">
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!--Product-->
      <div class="tg-widget">
        <div class="tg-widget-h">
          <div>
            Product Details
          </div>
          <div class="flex">
            <div class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
              <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
            </div>
            <div class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Brand">
              <plus-icon class="tg-widget-btn-icon" />
            </div>
          </div>
        </div>
        <div class="tg-table-container">
          <table class="tg-table">
            <thead>
              <tr>
                <td>Product Name</td>
                <td>Brand</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Michael Supplies</td>
                <td>Matina Corssing dapit sa</td>
                <td>
                  <div class="flex gap-[10px] justify-start !pr-[20px] ">
                    <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none">
                      Edit
                    </button>
                    <button class="btn h-[25px] p-[12px] shadow-md bg-[#fc5861] border-none">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!--Brand-->
      <div class="tg-widget">
        <div class="tg-widget-h">
          <div>
            Brands
          </div>
          <div class="flex">
            <div class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
              <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
            </div>
            <div class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Brand">
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
              <tr>
                <td>Michael Jackson</td>
                <td>
                  <div class="flex gap-[10px] justify-start !pr-[20px] ">
                    <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                      onclick="editUserModal.showModal()">
                      Edit
                    </button>
                    <button onclick="deleteUserModal.showModal()"
                      class="btn h-[25px] p-[12px] shadow-md bg-[#fc5861] border-none">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Michael Jackson</td>
                <td>
                  <div class="flex gap-[10px] justify-start !pr-[20px] ">
                    <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                      onclick="editUserModal.showModal()">
                      Edit
                    </button>
                    <button onclick="deleteUserModal.showModal()"
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

      <!--Supplier-->
      <div class="tg-widget">
        <div class="tg-widget-h">
          <div>
            Brands
          </div>
          <div class="flex">
            <div class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
              <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
            </div>
            <div class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Brand">
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
              <tr>
                <td>Michael Supplies</td>
                <td>Matina Corssing dapit sa</td>
                <td>mj@gmail.com</td>
                <td>+639163919956</td>
                <td>
                  <div class="flex gap-[10px] justify-start !pr-[20px] ">
                    <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                      onclick="editUserModal.showModal()">
                      Edit
                    </button>
                    <button onclick="deleteUserModal.showModal()"
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


    </div>
  </main>
</template>

<style scoped>
thead td {
  position: sticky;
  background-color: #5a3939;
  top: 0;
  padding: 13px 14px 13px 20px;
  font-size: 14px;
  color: rgb(245, 245, 245);
  font-weight: 700;
}

tr {
  line-height: 15px;
}

tbody td {
  height: 10px;
  font-size: 14px;
  padding: 12px 0 12px 20px;
  border-top: 1px solid rgb(124, 90, 90);
  font-variation-settings:
    "wdth" 75;

}

tbody td:last-child {
  padding-right: 12px;
}

.tbl-container {
  overflow: auto;
  max-height: 600px;
  width: 100%;
  height: 100%;
  padding: 6px;
  border-radius: 7px;
  background-color: #5a3939;
  box-shadow: inset -12px -8px 40px #421f1f5e;
}

/*Final CSS*/
.tg-table-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  max-height: 600px;
  padding: 6px;
  border-radius: 7px;

  background-color: #5a3939;
  box-shadow: inset -12px -8px 40px #421f1f5e;
}

.tg-table {
  flex-grow: 1;
  border-collapse: collapse;
  width: 100%;
}

/*Custom Widget */
.tg-widget {
  flex: 1 1 auto;
  overflow-x: hidden;
  user-select: none;
  display: flex;
  flex-direction: column;
  border-radius: 13px;
  background-color: #744e4e;
  color: white;
  padding: 13px;
  box-shadow: var(--shadow-md);
}

.tg-widget-h {
  display: flex;
  margin-bottom: 5px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-variation-settings:
    'wdth' 75;
}

.tg-widget-btn {
  background-color: transparent;
  border: 1px solid rgba(43, 39, 39, 0.404);
  border-radius: 10px;
  transition: all 300ms;
}

.tg-widget-btn:hover {
  background-color: rgba(43, 39, 39, 0.404);
}

.tg-widget-btn-icon {
  height: 20px;
  width: 20px;
  margin: 6px;

}
</style>