import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const SIDEBAR_STORAGE_KEY = 'react-template:sidebar'

type SidebarState = {
  collapsed: boolean
}

type SidebarActions = {
  toggleCollapsed: () => void
}

type SidebarStore = SidebarState & SidebarActions

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      collapsed: false,
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
    }),
    {
      name: SIDEBAR_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ collapsed: state.collapsed }),
    },
  ),
)
