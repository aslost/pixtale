"use client"

import { useState, type ChangeEvent } from "react"
import { toast } from "sonner"
import { AppSidebar } from "@/components/layout/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useApp } from "@/app/provider"
import { useSettingContext } from "@/app/settings/provider"
import { SettingItem } from "@/components/setting/setting-item"
import { settingSet } from "@/request/setting"
import { type Setting } from "@/server/entity/setting"
import { SettingPhotoDedupEnum, SettingSyncDeleteEnum } from "@/server/enums/setting-enum"

const syncDeleteOptions = [
  { label: "开启", value: SettingSyncDeleteEnum.ENABLE },
  { label: "关闭", value: SettingSyncDeleteEnum.DISABLE },
]

export default function Page() {
  const { sidebarOpen, setSidebarOpen } = useApp()
  const { initialSetting } = useSettingContext()
  // setting 保存当前页面正在编辑的系统设置。
  const [setting, setSetting] = useState<Setting>(initialSetting)

  // 修改同步删除开关值。
  function changeSyncDelete(syncDelete: string) {
    setSetting((prev) => ({
      ...prev,
      syncDelete: Number(syncDelete),
    }))
  }

  // 修改照片去重开关值。
  function changePhotoDedup(checked: boolean) {
    setSetting((prev) => ({
      ...prev,
      photoDedup: checked ? SettingPhotoDedupEnum.ENABLE : SettingPhotoDedupEnum.DISABLE,
    }))
  }

  // 修改回收站自动清理天数。
  function changeClearLast(event: ChangeEvent<HTMLInputElement>) {
    setSetting((prev) => ({
      ...prev,
      clearLast: Number(event.target.value || 0),
    }))
  }

  // 保存当前系统设置。
  function saveSetting() {
    settingSet(setting).then(() => {
      toast.success("保存成功")
    })
  }

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <AppSidebar />
      <SidebarInset>
        <header
          className="flex h-13 shrink-0 items-center justify-between gap-2 bg-background">
          <div className="flex min-w-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>设置</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="mx-auto flex w-full max-w-5xl flex-col px-5 py-3 md:py-4">
          <h1 className="text-xl font-semibold pb-3 md:pb-4">基本功能</h1>
          <Separator className="my-4" />
          <div className="flex flex-col">
            <SettingItem title="定时清理" description="使用定时任务，自动清理回收站照片">
              <InputGroup className="w-30">
                <InputGroupInput
                  id="clear-last"
                  type="number"
                  min="0"
                  max="30"
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  value={setting.clearLast || ""}
                  onChange={changeClearLast}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>天后</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </SettingItem>
            <SettingItem title="同步删除" description="删除照片的同时，删除已保存的文件">
              <RadioGroup
                className="flex flex-row gap-6"
                value={String(setting.syncDelete)}
                onValueChange={changeSyncDelete}
              >
                {syncDeleteOptions.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem id={`sync-delete-${option.value}`} value={String(option.value)} />
                    <Label htmlFor={`sync-delete-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </SettingItem>
            <SettingItem title="照片去重" description="根据图片名称+文件哈希，跳过重复上传">
              <Switch
                checked={setting.photoDedup === SettingPhotoDedupEnum.ENABLE}
                onCheckedChange={changePhotoDedup}
              />
            </SettingItem>
          </div>
          <div className="mt-8 flex justify-end">
            <Button type="button" onClick={saveSetting}>
              保存
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
