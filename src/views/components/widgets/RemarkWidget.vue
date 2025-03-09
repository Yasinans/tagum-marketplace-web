<script setup lang="ts">
import { PlusIcon, ArrowPathRoundedSquareIcon } from '@heroicons/vue/24/solid';
import { useRemark } from "../../../composable/useRemark";

const { 
    resetRemarkForm, 
    selectedRemarkId,
    remarkDatas, 
    messages, 
    remarkForm, 
    loadRemarks, 
    saveRemark, 
    deleteRemark 
}
  = useRemark();

</script>

<template>
  <div class="tg-widget">
    <div class="tg-widget-h">
      <div>
        Remarks
      </div>
      <div class="flex">
        <div @click="loadRemarks()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
          <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
        </div>
        <div @click="
            messages.add='';resetRemarkForm()
        " onclick="addRemarkModal.showModal()"
          class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Remark">
          <plus-icon class="tg-widget-btn-icon" />
        </div>
      </div>
    </div>
    <div class="tg-table-container">
      <table class="tg-table">
        <thead>
          <tr>
            <td>Remark</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="remark in remarkDatas" :key="remark.Remarks_ID">
            <td>{{ remark.Remarks }}</td>
            <td>
              <div class="flex gap-[10px] justify-start !pr-[20px] ">
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="editRemarkModal.showModal()" 
                  @click="messages.edit='';selectedRemarkId = remark.Remarks_ID, remarkForm={...remark}">
                  Edit
                </button>
                <button onclick="deleteRemarkModal.showModal()"
                 @click="messages.delete='';selectedRemarkId = remark.Remarks_ID, remarkForm={...remark}"
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

  <!--Add Remark Modal-->
  <dialog id="addRemarkModal" class="modal">
    <div class="modal-box !max-w-[300px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">Add Remark Info</p>
      </div>
      <div id="edit-form">
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Remark:</p>
          <input v-model="remarkForm.Remarks" type="text" placeholder="Remark"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
        </div>
        <div class="text-xs pt-2 text-[#f00] text-wrap">{{ messages.add }}</div>
      </div>
      <div class="modal-action">
        <button @click="saveRemark(false)" class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">
          Create Remark</button>
      </div>
    </div>
  </dialog>

  <!--Edit Remark Modal-->
  <dialog id="editRemarkModal" class="modal">
    <div class="modal-box !max-w-[300px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">Edit Remark Info</p>
        <div class="flex items-center ">
          <p class="text-[11px]">for</p>
          <div class="text-[10px] ml-[5px] bg-[#b07166] text-white w-min m-min px-1 py-1 rounded-[15px]">
            {{ remarkDatas.find(({ Remarks_ID }) => Remarks_ID === selectedRemarkId)?.Remarks }}
          </div>
        </div>
      </div>
      <div id="edit-form">
        <div class="pt-3 flex flex-col">
          <p class="text-xs pb-1">Remark:</p>
          <input v-model="remarkForm.Remarks" type="text" placeholder="Remark"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
        </div>
        <div class="text-xs pt-2 text-[#f00] text-wrap">{{ messages.edit }}</div>
      </div>
      <div class="modal-action">
        <button @click="saveRemark(true)" class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">Save
          Info</button>
      </div>
    </div>
  </dialog>

  <!--Delete Remark Modal-->
  <dialog id="deleteRemarkModal" class="modal">
    <div class="modal-box !max-w-[390px] p-5">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none">
        <p class="text-lg font-bold">Do you really want to delete this remark?</p>
        <div class="mt-1 text-xs fton-bold bg-[#b07166] text-white w-min m-min px-2 py-1 rounded-[15px]">
          {{ remarkForm.Remarks }}
        </div>
        <div class="text-xs pt-2 text-[#f00]">{{ messages.delete }}</div>
        <p class="text-[11px] mt-5">This action cannot be reversed</p>
        <button @click="deleteRemark()" class="mt-1 btn btn-error shadow-xs h-7">Delete</button>
      </div>

    </div>
  </dialog>
</template>
