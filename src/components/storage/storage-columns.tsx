"use client"

import { Column, ColumnDef } from "@tanstack/react-table"
import { IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StorageTypeEnum, StorageTypeOptions } from "@/server/enums/storage-enum"
import { type StorageVo } from "@/server/entity/vo/storage"

const storageStatusMap: Record<number, string> = {
  0: "正常",
  1: "禁用",
}

interface SortableHeaderProps {
  label: string
  column: Column<StorageVo, unknown>
}

interface StorageColumnsOptions {
  onEdit: (storage: StorageVo) => void
  onSetTop: (storageId: string) => void
  onToggleStatus: (storageId: string) => void
  onDelete: (storage: StorageVo) => void
}

// 渲染带固定排序图标的表头按钮。
function SortableHeader({ label, column }: SortableHeaderProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="-ml-2 h-8 px-2"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown />
    </Button>
  )
}

// 格式化存储容量为易读文本。
function formatCapacity(size: number) {
  if (!size) {
    return "0 B"
  }

  const units = ["B", "KB", "MB", "GB", "TB"]
  const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1)
  const value = size / 1024 ** index

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
}

// 渲染存储状态徽标。
function StorageStatusBadge({ status }: { status: number }) {
  const disabled = status === 1
  const Icon = disabled ? IconCircleXFilled : IconCircleCheckFilled
  const text = storageStatusMap[status] ?? status

  return (
    <Badge variant="outline" className="px-1.5 text-muted-foreground">
      <Icon className={disabled ? "fill-red-500" : "fill-green-500 dark:fill-green-400"} />
      {text}
    </Badge>
  )
}

// 创建存储列表列配置。
export function getStorageColumns({ onEdit, onSetTop, onToggleStatus, onDelete }: StorageColumnsOptions): ColumnDef<StorageVo>[] {
  return [
    {
      id: "index",
      header: '序号',
      enableHiding: false,
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "名称",
      meta: {
        className: 'w-1/3'
      }
    },
    {
      accessorKey: "type",
      header: "类型",
      cell: ({ row }) => StorageTypeOptions.find((item) => item.value === row.original.type)?.label ?? row.original.type,
    },
    {
      accessorKey: "usedCapacity",
      meta: {
        label: "已用储存",
      },
      header: ({ column }) => <SortableHeader label="已用储存" column={column} />,
      cell: ({ row }) => formatCapacity(row.original.usedCapacity),
    },
    {
      accessorKey: "photoTotal",
      meta: {
        label: "照片数量",
      },
      header: ({ column }) => <SortableHeader label="照片数量" column={column} />,
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => <StorageStatusBadge status={row.original.status ?? 0} />,
    },
    {
      id: "actions",
      header: '操作',
      enableHiding: false,
      meta: {
        className: "text-right"
      },
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="打开操作菜单">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>编辑</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus(row.original.storageId)}>
              {row.original.status === 0 ? "禁用" : "启用"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSetTop(row.original.storageId)}>置顶</DropdownMenuItem>
            <DropdownMenuItem
              disabled={row.original.type === StorageTypeEnum.LOCAL}
              onClick={() => onDelete(row.original)}
            >
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
