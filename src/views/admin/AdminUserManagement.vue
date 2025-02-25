<script setup lang="ts">
import {
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/vue/24/solid';
</script>

<template>
  <main class="flex text-nowrap flex-col gap-[16px] p-[26px]">
    <div class="font-med text-[18px] text-white tracking-tighter">User Management</div>
    <div class="flex items-center
 bg-[#744e4e] w-[100%] py-2 px-3 rounded-[13px] shadow-md">
      <label class="input text-[14px] h-[32px] grow bg-[#f7f2f2]">
        <magnifying-glass-icon class="h-[20px] pr-1" />
        <input type="search" class="grow" placeholder="Search Name">
      </label>
      <div class="dropdown dropdown-end tooltip" data-tip="Only show specific role">
        <div tabindex="0" role="button" class="flex btn h-[34px] px-3 shadow-md bg-[#f7f0f0] ml-2 border-[#4d2f2d] radius-[3px]">
          <p>Filter</p>
        </div>
        <ul tabindex="0" class="dropdown-content menu bg-[#1f1619] mt-[3px] rounded-box z-[1] w-34 shadow-lg text-white">
          <li><a>All</a></li>
          <li><a>Cashier</a></li>
          <li><a>Stockman</a></li>
          <li><a>Administrator</a></li>
        </ul>
      </div>
      <button onclick="addUserModal.showModal()" class="flex btn h-[34px] px-3 shadow-md bg-[#f7f0f0] ml-2 border-[#4d2f2d] radius-[3px]">
        <p>Create User</p><plus-icon class="h-[16px]" />
      </button>
    </div>
    <div class="h-[100%] rounded-[13px] bg-[#744e4e] text-white p-[13px] shadow-md flex">
      <div class="w-[100%] h-[100%] tbl-container overflow-x-auto">
        <table class="border-collapse w-[100%] grow">
          <thead>
            <tr>
              <td>Full Name</td>
              <td>Username</td>
              <td>Date of Birth</td>
              <td>Address</td>
              <td>Gender</td>
              <td>Contact No.</td>
              <td>Date Registered</td>
              <td>Role</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Michael Jackson</td>
              <td>HeheGaming2017</td>
              <td>July 19, 2021</td>
              <td>Calinan Toril Japan sa Davao</td>
              <td>Male</td>
              <td>+639163919956</td>
              <td>July 19, 2021</td>
              <td>
                <div class="text-xs bg-[#6671b0] text-white w-min m-min px-2 py-1 rounded-[15px]">Cashier
                </div>
              </td>
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
              <td>HeheGaming2017</td>
              <td>July 19, 2021</td>
              <td>Calinan Toril Japan sa Davao</td>
              <td>Male</td>
              <td>+639163919956</td>
              <td>July 19, 2021</td>
              <td>
                <div class="text-xs fton-bold bg-[#6671b0] text-white w-min m-min px-2 py-1 rounded-[15px]">Cashier
                </div>
              </td>
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
    <!--Edit User Modal-->
    <dialog id="editUserModal" class="modal">
      <div class="modal-box !max-w-[300px]">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="leading-none mb-1">
          <p class="text-lg font-bold">Edit User Info</p>
          <div class="flex items-center ">
            <p class="text-[11px]">for</p>
            <div class="text-[10px] ml-[5px] bg-[#b07166] text-white w-min m-min px-1 py-1 rounded-[15px]">
              HeheGaming2017</div>
          </div>
        </div>
        <div id="edit-form">
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Full Name:</p>
            <input id="edit-fname" type="text" placeholder="Full Name" class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Username:</p>
            <input id="edit-uname" type="text" placeholder="Username" class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Date of Birth:</p>
            <input id="edit-dob" type="date" placeholder="Full Name" class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Address:</p>
            <input id="edit-add" type="text" placeholder="Address" class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Gender:</p>
            <select id="edit-gender" class="rounded-[6px] px-2 py-1 max-w-xs">
              <option disabled selected>Select Your Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Others</option>
            </select>
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Contact Number:</p>
            <input id="edit-no" type="text" placeholder="Contact Number" class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Role:</p>
            <select id="edit-role" class="rounded-[6px] px-2 py-1 max-w-xs">
              <option disabled selected>Role</option>
              <option>Cashier</option>
              <option>Stockman</option>
              <option>Administrator</option>
            </select>
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">New Password:</p>
            <input id="edit-pass" type="text" placeholder="New Password" class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
        </div>
        <div class="modal-action">
          <button class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">Save Info</button>
        </div>
      </div>
    </dialog>
    <!--Delete Modal-->
    <dialog id="deleteUserModal" class="modal">
      <div class="modal-box !max-w-[390px] p-5">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="leading-none">
          <p class="text-lg font-bold">Do you really want to delete this user?</p>
          <div class="mt-1 text-xs fton-bold bg-[#b07166] text-white w-min m-min px-2 py-1 rounded-[15px]">
            HeheGaming2017</div>
          <p class="text-[11px] mt-5">This action cannot be reversed</p>
          <button class="mt-1 btn btn-error shadow-xs h-7">Delete</button>
        </div>

      </div>
    </dialog>
     <!--Add User Modal-->
     <dialog id="addUserModal" class="modal">
      <div class="modal-box !max-w-[300px]">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <p class="text-lg font-bold">Create New User</p>

        <div id="newUser-form">
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Full Name:</p>
            <input id="new-fname" type="text" placeholder="Full Name" class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Username:</p>
            <input id="new-uname" type="text" placeholder="Username" class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Date of Birth:</p>
            <input id="new-dob" type="date" placeholder="Full Name" class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Address:</p>
            <input id="new-add" type="text" placeholder="Address" class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Gender:</p>
            <select id="new-gender" class="rounded-[6px] px-2 py-1 max-w-xs">
              <option disabled selected>Select Your Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Others</option>
            </select>
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Contact Number:</p>
            <input id="new-no" type="text" placeholder="Contact Number" class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Role:</p>
            <select id="new-role" class="rounded-[6px] px-2 py-1 max-w-xs">
              <option disabled selected>Role</option>
              <option>Cashier</option>
              <option>Stockman</option>
              <option>Administrator</option>
            </select>
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Password:</p>
            <input id="new-pass" type="text" placeholder="Password" class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Confirm Password:</p>
            <input id="confirm-new-pass" type="text" placeholder="Confirm Password" class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
        </div>
        <div class="modal-action">
          <button class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">Create User</button>
        </div>
      </div>
    </dialog>
  </main>
</template>

<style scoped>
.saveinfo {
  border-color: rgb(117, 117, 117);
  color: white;
  background-color: rgb(77, 74, 74);
}

.modal-box {
  color: rgb(39, 38, 38);
  font-size: 14px;
  background-color: #ebbb95;
}

.modal-box select,
.modal-box input {
  border: transparent;
  background-color: #ffffff;

}

.tbl-container {
  padding: 6px;
  border-radius: 7px;
  background-color: #5a3939;
  box-shadow: inset -12px -8px 40px #421f1f5e;
}

thead td {
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
</style>