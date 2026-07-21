"use client"

import { create } from "zustand"
import { type StorageSelectVo } from "@/server/entity/vo/storage"

// 这个模块管理存储配置下拉选项状态。

interface StorageState {
  storages: StorageSelectVo[]
  setStorages: (storages: StorageSelectVo[]) => void
}

// 读取和更新全局存储配置选项。
const useStorageStore = create<StorageState>((set) => ({
  storages: [],

  // 设置存储配置选项列表。
  setStorages: (storages) => set({ storages }),
}))

export { useStorageStore }
