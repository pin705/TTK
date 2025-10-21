import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    character: null as any | null,
  }),
  actions: {
    setCharacter(data: any) {
      this.character = data
    },
    // Hàm mới để cập nhật từng phần của character
    updateCharacter(updates: Record<string, any>) {
      if (this.character)
        this.character = { ...this.character, ...updates }
    },
  },
})
