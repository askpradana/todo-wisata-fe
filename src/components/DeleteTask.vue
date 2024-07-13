<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
      <h3 class="text-lg font-medium mb-4">{{ title }}</h3>
      <p class="text-gray-600 mb-6">{{ message }}</p>
      <div class="flex justify-end space-x-3">
        <button
          @click="onCancel"
          class="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
        >
          Cancel
        </button>
        <button
          @click="onConfirm"
          class="px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    isOpen: Boolean,
    title: String,
    message: String
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const onConfirm = () => {
      emit('confirm')
    }

    const onCancel = () => {
      emit('cancel')
    }

    return {
      onConfirm,
      onCancel
    }
  }
}
</script>
