/*
 * Copyright Regione Piemonte - 2023
 * SPDX-License-Identifier: EUPL-1.2
 */

import { Notify } from 'quasar'

export const notifySuccess = message => {
  Notify.create({ type: 'positive', message })
}
export const notifyError = (error, message, opt = {}) => {
  console.error(error)

  const code = error?.response?.status
  if (code) message = `[${code}] ${message}`

  opt.color = 'negative'
  opt.message = message

  Notify.create(opt)
};

export const isBeforeDate = (date) => {
  return new Date(date).valueOf() < new Date().valueOf()
};

export const notTooOldDate = (date) => {
  const controlYear= new Date();
  controlYear.setFullYear(controlYear.getFullYear() - 110);
  return new Date(date).valueOf() > controlYear.valueOf()
};
// export const notifyError = (error, message, persistent = false) => {
//   console.error(error)

//   const code = error?.response?.status
//   if (code) message = `[${code}] ${message}`

//   const config = {
//     color: 'negative',
//     message: message
//   }

//   if (persistent) {
//     config.timeout = 0
//     config.actions = [
//       {
//         icon: 'close',
//         color: 'white',
//         flat: true,
//         round: true,
//         size: 'sm'
//       }
//     ]
//   }

//   Notify.create(config)
// }

export const downloadCsv = (csv, fileName) => {
  const anchor = document.createElement('a')
  anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
  anchor.target = '_blank'
  anchor.download = fileName
  anchor.click()
}

export const validateMail = (mail) => {
  const EMAIL_REGEX = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/

  return EMAIL_REGEX.test(mail)
}

export const removeSpaces = (string) => {
  return string.replace(/\s/g, '')
}

export const sortBy = (arr, prop, descending = false, isDate = false) => {
  const result = [...arr]

  result.sort((a, b) => {
    a = a[prop]
    b = b[prop]

    if (isDate) {
      a = new Date(a)
      b = new Date(b)
    }

    if (descending) return a < b ? 1 : -1
    return a > b ? 1 : -1
  })

  return result
}

// Funzione che serve a selezionare o deselezionare elementi da un array
export const selectFromArray = (array, rows, added) => {
  if (added) {
    return array.concat(rows)
  } else {
    return array.filter((nota) => !rows.includes(nota))
  }
}

// Funzione che serve a convertire un oggetto in una stringa di parametri GET
export const jsonToParamsString = (json) => {
  const array = []

  for (const param in json) {
    const value = json[param]

    if (value !== null && value !== undefined) {
      array.push(`${param}=${value}`)
    }
  }

  return `?${array.join('&')}`
}

// Funzione che inverte la data in input
export const invertDate = (date) => {
  const separator = date.includes('/') ? '/' : '-'

  const splittedDate = date.split(separator)

  return `${splittedDate[2]}${separator}${splittedDate[1]}${separator}${splittedDate[0]}`
}

export const nextMonday = () => {
  const today = new Date()
  const dayOfWeek = today.getDay()

  let daysToAdd

  switch (dayOfWeek) {
    case 0:
      daysToAdd = 1
      break
    default:
      daysToAdd = 8 - dayOfWeek
  }

  today.setDate(today.getDate() + daysToAdd)
  // today.setDate(today.getDate() + (daysToAdd -1))

  return dateToString(today)
}

export const isDateGreaterThanDate = (left, right) => {
  left = left.getTime()
  right = right.getTime()
  if (left > right) {
    return true
  }
  return false
}

export const getOnlyDate = (date) => {
  return date?.split('T')[0]
}

export const dateToString = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

export const dateToStringYearMonth = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}}`
}

export const timeToString = (date) => {
  return `${date.getHours()}:${date.getMinutes()}`
}

export const dateTimeToString = (date) => {
  return `${dateToString(date)} ${timeToString(date)}`
}

let timeout

export const debounce = (context, func, wait, immediate) => {
  var later = function () {
    timeout = null
    if (!immediate) func(context)
  }

  var callNow = immediate && !timeout

  clearTimeout(timeout)

  timeout = setTimeout(later, wait)

  if (callNow) func(context)
}

export const getUri = (cfg) => {

  function isArray(val) {
    return toString.call(val) === '[object Array]'
  }

  function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
  }

  function isDate(val) {
    return toString.call(val) === '[object Date]'
  }

  function isObject(val) {
    return val !== null && typeof val === 'object'
  }

  function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj]
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj)
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj)
        }
      }
    }
  }

  function encode(val) {
    return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']')
  }

  function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url
    }

    let serializedParams
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params)
    } else if (isURLSearchParams(params)) {
      serializedParams = params.toString()
    } else {
      var parts = []

      forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return
        }

        if (isArray(val)) {
          key = key + '[]'
        } else {
          val = [val]
        }

        forEach(val, function parseValue(v) {
          if (isDate(v)) {
            v = v.toISOString()
          } else if (isObject(v)) {
            v = JSON.stringify(v)
          }
          parts.push(encode(key) + '=' + encode(v))
        })
      })

      serializedParams = parts.join('&')
    }

    if (serializedParams) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
    }

    return url
  }


  return buildURL(cfg.url, cfg.params, cfg.paramsSerializer)
};

export const isValidCF = (cf) => {
  let validi, i, s, set1, set2, setpari, setdisp;
  if(!cf)  return false;
  cf = cf.toUpperCase();
  if(cf.length !== 16) return false;
  validi = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for( i = 0; i < 16; i++ ) {
    if( validi.indexOf( cf.charAt(i) ) === -1 ) return false
  }
  set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
  setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
  s = 0;
  for( i = 1; i <= 13; i += 2 )
    s += setpari.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));
  for( i = 0; i <= 14; i += 2 )
    s += setdisp.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));
  if( s%26 !== cf.charCodeAt(15)-'A'.charCodeAt(0) )
    return false

  return true
};

export const file2Base64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = error => reject(error);
    reader.onload = () => {
      let result = reader.result;
      // result = result.substring(result.indexOf(",") + 1);
      resolve(result);
    };
  });
