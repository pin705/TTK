import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
  state: () => ({
    currentZone: null as any | null,
  }),
  actions: {
    setCurrentZone(data: any) {
      this.currentZone = data
    },
  },
})
