import { firstDayOfEachMonth, numberOfDaysEachMonth } from './constants';
import type { FormatToken } from './parse'


export function getFirstWeekDay(year:number, month:number): number {
  
  if(year<2076 && year>2100) return 0;  
  //@ts-ignore
return firstDayOfEachMonth[year][month]
}

export function getMonthLength(year: number, month: number): number {

  if(year<2076 && year>2100) return 30;
    //@ts-ignore
    return numberOfDaysEachMonth[year][month];
} 
//TODO: toText function
export function toText(date: Date | null, formatTokens: FormatToken[]): string {
  let text = ''
  if (date) {
    for (const token of formatTokens) {
      if (typeof token === 'string') {
        text += token
      } else {
        text += token.toString(date)
      }
    }
  }
  return text
}

export type CalendarDay = {
  year: number
  month: number
  number: number
}
export function getMonthDays(year: number, month: number): CalendarDay[] {
  const monthLength = getMonthLength(year, month)
  const days: CalendarDay[] = []
  for (let i = 0; i < monthLength; i++) {
    days.push({
      year: year,
      month: month,
      number: i + 1,
    })
  }
  return days
}
export function getCalendarDays(value: Date, weekStartsOn: number): CalendarDay[] {
  const year = value.getFullYear() // Need to use another way
  const month = value.getMonth() // Need to use another way
  const firstWeekday = getFirstWeekDay(year,month)  // old ways > new Date(year, month, 1).getDay()

  let days: CalendarDay[] = []

  // add last month
  const daysBefore = (firstWeekday - weekStartsOn + 7) % 7
  if (daysBefore > 0) {
    let lastMonth = month - 1
    let lastMonthYear = year
    if (lastMonth === -1) {
      lastMonth = 11
      lastMonthYear = year - 1
    }
    days = getMonthDays(lastMonthYear, lastMonth).slice(-daysBefore)
  }

  // add current month
  days = days.concat(getMonthDays(year, month))

  // add next month
  let nextMonth = month + 1
  let nextMonthYear = year
  if (nextMonth === 12) {
    nextMonth = 0
    nextMonthYear = year + 1
  }
  const daysAfter = 42 - days.length
  days = days.concat(getMonthDays(nextMonthYear, nextMonth).slice(0, daysAfter))

  return days
}
