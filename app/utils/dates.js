import dayjs from 'dayjs'

export const dateCompPad = (n) => {
  return n < 10 ? '0' + n : n
}

export const formatDateString = (dateString, delimiter = '/') => {
  if (!dateString) return 'None'
  else {
    const date = new Date(dateString)

    const month = date.getMonth(dateString) + 1
    const dom = date.getDate(dateString) + 1
    const year = date.getFullYear(dateString)

    return month + delimiter + dom + delimiter + year
  }
}

export const getTodayAsPaddedString = () => {
  const date = new Date()

  const month = date.getMonth(date) + 1
  const dom = date.getDate(date)
  const year = date.getFullYear(date)

  return year + '-' + dateCompPad(month) + '-' + dateCompPad(dom)
}

export const getDateAsPaddedString = (isoDate) => {
  const date = dayjs(isoDate).toDate()

  const month = date.getMonth(date) + 1
  const dom = date.getDate(date)
  const year = date.getFullYear(date)

  return year + '-' + dateCompPad(month) + '-' + dateCompPad(dom)
}

export const getYearMonthAsPaddedString = (isoDate) => {
  const date = dayjs(isoDate).toDate()

  const month = date.getMonth(date) + 1
  const year = date.getFullYear(date)

  return year + '-' + dateCompPad(month)
}

export const getLastMonthAsPaddedString = () => {
  const date = dayjs().subtract(1, 'month')

  const month = date.month() + 1
  const year = date.year()

  return year + '-' + dateCompPad(month)
}

export const formatMonthYear = (date) => {
  return dayjs(date).format('MM/YYYY')
}

export const formatMonthYearAbr = (date) => {
  return dayjs(date).format('MMM YYYY')
}

export const formatMonthYearFull = (date) => {
  return dayjs(date).format('MMMM YYYY')
}

export const formatDateFull = (date) => {
  return dayjs(date).format('MMMM D, YYYY')
}

export const formatTimeStamp = (date) => {
  return dayjs(date).format('MM/DD/YYYY HH:mm:ss')
}

export const dateDiff = (date1, date2, unit) => {
  return dayjs(date1).diff(date2, unit)
}
