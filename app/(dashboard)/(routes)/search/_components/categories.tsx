'use client'

import { IconType } from 'react-icons'
import { ICategory } from '@/models/Category'
import {
  FcMusic,
  FcFilmReel,
  FcSportsMode,
  FcEngineering,
  FcOldTimeCamera,
  FcMultipleDevices,
  FcSalesPerformance,
} from 'react-icons/fc'

import { CategoryItem } from './category-item';

interface CategoriesProps {
  items: ICategory[]
}

const iconMap: Record<ICategory['name'], IconType> = {
  "Music": FcMusic,
  "Filming": FcFilmReel,
  "Coding": FcMultipleDevices,
  "Fitness": FcSportsMode,
  "Engineering": FcEngineering,
  "Photography": FcOldTimeCamera,
  "Accounting": FcSalesPerformance,
  "Computer Science": FcMultipleDevices,
}

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center pb-2 overflow-x-auto gap-x-2">
      {items.map(item => (
        <CategoryItem
          key={item._id}
          value={item._id}
          label={item.name}
          icon={iconMap[item.name]}
        />
      ))}
    </div>
  )
}