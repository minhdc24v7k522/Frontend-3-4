<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>
    <div class="mt-3">
      <h5>Lọc theo sở thích</h5>
      <div
        v-for="interest in allInterests"
        :key="interest"
        class="form-check form-check-inline"
      >
        <input
          class="form-check-input"
          type="checkbox"
          :value="interest"
          v-model="selectedInterests"
        />
        <label class="form-check-label">{{ interest }}</label>
      </div>
    </div>
    <div class="mt-3 col-md-6">
      <h4>
        Danh bạ
        <i class="fas fa-address-book"></i>
      </h4>
      <ContactList
        v-if="filteredContactsCount > 0"
        :contacts="filteredContacts"
        v-model:activeIndex="activeIndex"
      />
      <p v-else>Không có liên hệ nào.</p>
      <div class="mt-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList()">
          <i class="fa-brands fa-debian"></i> Làm mới
        </button>
        <button class="btn btn-sm btn-success" @click="goToAddContact">
          <i class="fa-solid fa-plus"></i> Thêm mới
        </button>
        <button class="btn btn-sm btn-danger" @click="removeAllContacts">
          <i class="fa-solid fa-trash-can"></i> Xóa tất cả
        </button>
      </div>
    </div>
    <div class="mt-3 col-md-6">
      <div v-if="activeContact">
        <h4>
          Chi tiết Liên hệ
          <i class="fas fa-address-card"></i>
        </h4>
        <ContactCard :contact="activeContact" />
        <router-link
          :to="{
            name: 'contact.edit',
            params: { id: activeContact._id },
          }"
        >
          <span class="mt-2 badge badge-warning">
            <i class="fas fa-edit"></i> Hiệu chỉnh</span
          >
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ContactCard from "@/components/ContactCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import ContactList from "@/components/ContactList.vue";
import ContactService from "@/services/contact.service";

export default {
  components: {
    ContactCard,
    InputSearch,
    ContactList,
  },
  data() {
    return {
      contacts: [],
      activeIndex: -1,
      searchText: "",
      selectedInterests: [], // thêm mảng lọc
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
    },
  },
  computed: {
    contactStrings() {
      return this.contacts.map((contact) => {
        const { name, email, address, phone } = contact;
        return [name, email, address, phone].join("");
      });
    },
    // Lấy danh sách các sở thích có trong tất cả contact
    allInterests() {
      const set = new Set();
      this.contacts.forEach((c) => {
        if (c.interests && Array.isArray(c.interests)) {
          c.interests.forEach((i) => set.add(i));
        }
      });
      return Array.from(set);
    },
    filteredContacts() {
      let contacts = this.contacts;
      // Lọc theo từ khóa
      if (this.searchText) {
        contacts = contacts.filter((_contact, index) =>
          this.contactStrings[index].includes(this.searchText),
        );
      }
      // Lọc theo sở thích (nếu có chọn)
      if (this.selectedInterests.length > 0) {
        contacts = contacts.filter((contact) => {
          if (!contact.interests || !Array.isArray(contact.interests))
            return false;
          return this.selectedInterests.some((interest) =>
            contact.interests.includes(interest),
          );
        });
      }
      return contacts;
    },
    activeContact() {
      if (this.activeIndex < 0) return null;
      return this.filteredContacts[this.activeIndex];
    },
    filteredContactsCount() {
      return this.filteredContacts.length;
    },
  },
  methods: {
    async retrieveContacts() {
      try {
        this.contacts = await ContactService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrieveContacts();
      this.activeIndex = -1;
      this.selectedInterests = []; // reset lọc
    },
    async removeAllContacts() {
      if (confirm("Bạn muốn xóa tất cả Liên hệ?")) {
        try {
          await ContactService.deleteAll();
          this.refreshList();
        } catch (error) {
          console.log(error);
        }
      }
    },
    goToAddContact() {
      this.$router.push({ name: "contact.add" });
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style>
