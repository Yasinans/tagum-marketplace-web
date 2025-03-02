<script setup lang="ts">
import axios from "axios";
import { computed, ref, reactive, onMounted } from "vue";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/vue/24/solid";

// data interfacess
interface EmployeeData {
  id: number;
  name: string;
  username: string;
  dob: string;
  address: string;
  gender: string;
  contactno: string;
  dateReg: string;
  role: string;
}

const nameSearch = ref("");
const roleFilter = ref("");
const EmployeeDatas = ref<EmployeeData[]>([]);
const messages = reactive({ edit: "", add: "", delete: "" });
const selectedUserId = ref<number | null>(null);
const userForm = reactive({
  name: "",
  username: "",
  dob: "",
  address: "",
  gender: "",
  contactno: "",
  role: "",
  password: "",
  confirmPassword: "",
});

const filteredEmployeeDatas = computed(() =>
  EmployeeDatas.value.filter(
    (e) =>
      e.name.toLowerCase().includes(nameSearch.value.toLowerCase()) &&
      (roleFilter.value === "" || e.role === roleFilter.value)
  )
);

const loadUser = async () => {
  try {
    const [usersRes, employeesRes] = await Promise.all([
      axios.get("http://localhost:3000/api/user"),
      axios.get("http://localhost:3000/api/employee"),
    ]);

    EmployeeDatas.value = usersRes.data.map((user: any) => {
      const employee = employeesRes.data.find((e: any) => e.Employee_ID === user.Employee_ID);
      return {
        id: user.Employee_ID,
        name: employee?.Employee_Name || "",
        username: user.Username,
        dob: convertToInputDate(employee?.Employee_DOB),
        address: employee?.Employee_Address || "",
        gender: employee?.Employee_Gender || "",
        contactno: employee?.Employee_ContactNo || "",
        dateReg: formatDate(user.User_DateReg),
        role: capitalize(user.Role),
      };
    });
  } catch (err) {
    console.error("Error loading users:", err);
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString("default", { month: "long", day: "numeric", year: "numeric" });
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const deleteUser = async () => {
  if (!selectedUserId.value) return (messages.delete = "No user selected.");

  try {
    await axios.delete(`http://localhost:3000/api/employee/${selectedUserId.value}`);
    (document.getElementById("deleteUserModal") as HTMLDialogElement).close();
    loadUser();
  } catch (err) {
    messages.delete = axios.isAxiosError(err) ? err.response?.data?.message || "Server error" : "Unexpected error.";
  }
};

const saveUser = async (isEdit: boolean) => {
  if (!userForm.name || !userForm.username || !userForm.dob || !userForm.address || !userForm.contactno || !userForm.role || !userForm.gender) {
    messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
    return;
  }
  const contactNoRegex = /^\+?\d{12}$/;
  if (!contactNoRegex.test(userForm.contactno)) {
    messages[isEdit ? "edit" : "add"] = "Contact number should be in the format +639xxxxxxxxx or 09xxxxxxxxx.";
    return;
  }
  if (!isEdit && userForm.password !== userForm.confirmPassword) {
    messages.add = "Passwords do not match.";
    return;
  }

  try {
    if (isEdit) {
      await axios.put(`http://localhost:3000/api/employee/${selectedUserId.value}`, userForm);
      await axios.put(`http://localhost:3000/api/user/${selectedUserId.value}`, { username: userForm.username, role: userForm.role });
      (document.getElementById("editUserModal") as HTMLDialogElement).close();
    } else {
      const employeeRes = await axios.post("http://localhost:3000/api/employee", userForm);
      await axios.post("http://localhost:3000/api/user", { ...userForm, employeeId: employeeRes.data.id });
      (document.getElementById("addUserModal") as HTMLDialogElement).close();
    }
    loadUser();
  } catch (err) {
    messages[isEdit ? "edit" : "add"] = axios.isAxiosError(err) ? err.response?.data?.message || "Server error" : "Unexpected error.";
  }
};

const convertToInputDate = (dateStr: string) => {
  if (!dateStr) return "";
  const parsedDate = new Date(dateStr);
  if (isNaN(parsedDate.getTime())) return "";
  return parsedDate.toISOString().split("T")[0];
};

const loadUserModal = (id: number, isEdit: boolean) => {
  selectedUserId.value = id;
  messages.edit = "";
  messages.add = "";
  messages.delete = "";

  const employee = EmployeeDatas.value.find((e) => e.id === id);
  if (employee && isEdit) {
    userForm.dob = convertToInputDate(employee.dob);
    Object.assign(userForm, employee);
  } else {
    Object.assign(userForm, employee);
    if (id === 0) {
      Object.assign(userForm, {
        name: "",
        username: "",
        dob: "",
        address: "",
        gender: "",
        contactno: "",
        role: "",
      });
    }
  }
};

onMounted(loadUser);
</script>


<template>
  <main class="flex text-nowrap flex-col gap-[16px] p-[26px]">
    <div class="font-med text-[18px] text-white tracking-tighter">User Management</div>
    <div class="flex items-center
 bg-[#744e4e] w-[100%] py-2 px-3 rounded-[13px] shadow-md">
      <label class="input text-[14px] h-[32px] grow bg-[#f7f2f2]">
        <magnifying-glass-icon class="h-[20px] pr-1" />
        <input type="search" class="grow" placeholder="Search Name" v-model="nameSearch">
      </label>
      <div class="dropdown dropdown-end tooltip" data-tip="Only show specific role">
        <div tabindex="0" role="button"
          class="flex btn h-[34px] px-3 shadow-md bg-[#f7f0f0] ml-2 border-[#4d2f2d] radius-[3px]">
          <p>Filter</p>
        </div>
        <ul tabindex="0"
          class="dropdown-content menu bg-[#1f1619] mt-[3px] rounded-box z-[1] w-34 shadow-lg text-white">
          <li><a :class="{ 'bg-[#140E12]': roleFilter === '' }" @click="roleFilter = ''">All</a></li>
          <li><a :class="{ 'bg-[#140E12]': roleFilter === 'Cashier' }" @click="roleFilter = 'Cashier'">Cashier</a></li>
          <li><a :class="{ 'bg-[#140E12]': roleFilter === 'Stockman' }" @click="roleFilter = 'Stockman'">Stockman</a>
          </li>
          <li><a :class="{ 'bg-[#140E12]': roleFilter === 'Admin' }" @click="roleFilter = 'Admin'">Administrator</a>
          </li>
        </ul>
      </div>
      <button onclick="addUserModal.showModal()" @click="loadUserModal(0, false)"
        class="flex btn h-[34px] px-3 shadow-md bg-[#f7f0f0] ml-2 border-[#4d2f2d] radius-[3px]">
        <p>Create User</p><plus-icon class="h-[16px]" />
      </button>
    </div>
    <div class="h-[100%] rounded-[13px] bg-[#744e4e] text-white p-[13px] shadow-md flex">
      <div class="tg-table-container tg-main-table">
        <table class="tg-table">
          <thead>
            <tr>
              <td>ID #</td>
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
            <tr v-for="EmployeeData in filteredEmployeeDatas" :key="EmployeeData.id">
              <td>{{ EmployeeData.id }}</td>
              <td>{{ EmployeeData.name }}</td>
              <td>{{ EmployeeData.username }}</td>
              <td>{{ formatDate(EmployeeData.dob) }}</td>
              <td>{{ EmployeeData.address }}</td>
              <td>{{ EmployeeData.gender }}</td>
              <td>{{ EmployeeData.contactno }}</td>
              <td>{{ EmployeeData.dateReg }}</td>
              <td>
                <div
                  class="text-xs text-white w-min m-min px-2 py-1 rounded-[15px]"
                  :class="{
                    'bg-[#6671b0]': EmployeeData.role === 'Cashier',
                    'bg-[#4e8253]': EmployeeData.role === 'Stockman',
                    'bg-[#f2227c]': EmployeeData.role === 'Admin',
                  }">
                  {{ EmployeeData.role }}
                  
                </div>
              </td>
              <td>
                <div class="flex gap-[10px] justify-start !pr-[20px] ">
                  <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                    onclick="editUserModal.showModal()" @click="loadUserModal(EmployeeData.id, true)">
                    Edit
                  </button>
                  <button onclick="deleteUserModal.showModal()" @click="loadUserModal(EmployeeData.id, false)"
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
              {{ userForm.username }}
            </div>
          </div>
        </div>
        <div id="edit-form">
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Full Name:</p>
            <input v-model="userForm.name" type="text" placeholder="Full Name"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Username:</p>
            <input v-model="userForm.username" type="text" placeholder="Username"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Date of Birth:</p>
            <input v-model="userForm.dob" type="date" placeholder="Full Name"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Address:</p>
            <input v-model="userForm.address" type="text" placeholder="Address"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Gender:</p>
            <select v-model="userForm.gender" class="rounded-[6px] px-2 py-1 max-w-xs">
              <option disabled selected>Select Your Gender</option>
              <option id="Male" value="Male">Male</option>
              <option id="Female" value="Female">Female</option>
              <option id="Others" value="Others">Others</option>
            </select>
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Contact Number:</p>
            <input v-model="userForm.contactno" type="text" placeholder="Contact Number"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Role:</p>
            <select v-model="userForm.role" class="rounded-[6px] px-2 py-1 max-w-xs">
              <option disabled selected>Role</option>
              <option id="Cashier" value="Cashier">Cashier</option>
              <option id="Stockman" value="Stockman">Stockman</option>
              <option id="Admin" value="Admin">Admin</option>
            </select>
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">New Password:</p>
            <input v-model="userForm.password" type="text" placeholder="New Password"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="text-xs pt-2 text-[#f00] text-wrap">{{ messages.edit }}</div>

        </div>
        <div class="modal-action">
          <button @click="saveUser(true)" class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">Save
            Info</button>
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
            {{ userForm.username }}
          </div>
          <div class="text-xs pt-2 text-[#f00]">{{ messages.delete }}</div>
          <p class="text-[11px] mt-5">This action cannot be reversed</p>
          <button @click="deleteUser()" class="mt-1 btn btn-error shadow-xs h-7">Delete</button>
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
            <input v-model="userForm.name" type="text" placeholder="Full Name"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Username:</p>
            <input v-model="userForm.username" type="text" placeholder="Username"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Date of Birth:</p>
            <input v-model="userForm.dob" type="date" placeholder="Full Name"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Address:</p>
            <input v-model="userForm.address" type="text" placeholder="Address"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Gender:</p>
            <select v-model="userForm.gender" class="rounded-[6px] px-2 py-1 max-w-xs">
              <option disabled selected>Select Your Gender</option>
              <option id="Male" value="Male">Male</option>
              <option id="Female" value="Female">Female</option>
              <option id="Others" value="Others">Others</option>
            </select>
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Contact Number:</p>
            <input v-model="userForm.contactno" type="text" placeholder="Contact Number"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Role:</p>
            <select v-model="userForm.role" class="rounded-[6px] px-2 py-1 max-w-xs">
              <option disabled selected>Role</option>
              <option id="Cashier" value="cashier">Cashier</option>
              <option id="Stockman" value="stockman">Stockman</option>
              <option id="Admin" value="admin">Admin</option>
            </select>
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Password:</p>
            <input v-model="userForm.password" type="text" placeholder="Password"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="pt-3 flex flex-col">
            <p class="text-xs pb-1">Confirm Password:</p>
            <input v-model="userForm.confirmPassword" type="text" placeholder="Confirm Password"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
          </div>
          <div class="text-xs pt-2 text-[#f00] text-wrap">{{ messages.add }}</div>
        </div>
        <div class="modal-action">
          <button @click="saveUser(false)" class="btn shadow-md  text-[#3f1e61] border-[#877cde] border-1 h-9">Create
            User</button>
        </div>
      </div>
    </dialog>
  </main>
</template>

<style scoped>

</style>