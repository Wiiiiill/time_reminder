import { read, utils } from 'xlsx'
import fs from 'file-saver'
import XLSX from 'xlsx' // 引入xlsx
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import Footer from './Footer'
!localStorage.getItem('dates') && localStorage.setItem('dates', JSON.stringify([]))
const s2ab = (s) => {
  if (typeof ArrayBuffer !== 'undefined') {
    let buf = new ArrayBuffer(s.length)
    let view = new Uint8Array(buf)
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  } else {
    let buf = new Array(s.length)
    for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff
    return buf
  }
}
export default function App() {
  const [ram, setRam] = useState(1)
  ram
  const [showAdd, setShowAdd] = useState(false)
  const [dates, setDates] = useState(JSON.parse(localStorage.getItem('dates')))
  const [obj, setObj] = useState({ code: '', time: '', reminder: true })
  useEffect(() => {
    let timer = setInterval(() => {
      setRam(Math.random())
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])
  useEffect(() => {
    let timer = setInterval(() => {
      setRam(Math.random())
      let curt = new Date().getTime()
      dates
        .filter((e) => e.reminder)
        .forEach((e) => {
          console.log(e, curt - new Date(e.t3).getTime())
          if (new Date(e.t3).getTime() - curt <= 3600000) {
            alert(`编号:${e.code}的3.3天快到了`)
          }
          if (new Date(e.t5).getTime() - curt <= 3600000) {
            alert(`编号:${e.code}的5天快到了`)
          }
        })
    }, 60000)
    return () => {
      clearInterval(timer)
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('dates', JSON.stringify(dates))
    setShowAdd(false)
  }, [dates])
  const onSubmit = (e) => {
    e.preventDefault()
    if (!obj.code) {
      alert('输入编号')
      return
    }
    if (!obj.time) {
      alert('输入时间')
      return
    }
    if (!isValidDate(new Date(obj.time))) {
      alert('输入可识别的时间')
      return
    }
    setDates([
      ...dates,
      {
        ...obj,
        time: dayjs(new Date(obj.time)).format('YYYY-MM-DD HH:mm:ss'),
        t3: getT3(obj.time),
        t5: getT5(obj.time)
      }
    ])
    setObj({ code: '', time: '', reminder: true })
  }
  const isValidDate = function (date) {
    return date instanceof Date && !isNaN(date.getTime())
  }
  //例如说我有一期是周二12点45分上传的 那么正常来说是 周五19点45分到时
  //有一期是周五12点45分上传的 周三19点45分到时
  //然后如果是周末上传的 都统一调整为周一的00:00上传
  const d1 = 86400000
  const d2 = 172800000
  const d5 = 432000000
  const getT3 = function (date) {
    let before = new Date(date)
    if (before.getDay() == 0) {
      let t = new Date(before.getTime() + d1)
      t.setHours(0)
      t.setMinutes(0)
      t.setMilliseconds(0)
      t.setSeconds(0)
      return getT3(t)
    }
    if (before.getDay() == 6) {
      let t = new Date(before.getTime() + d2)
      t.setHours(0)
      t.setMinutes(0)
      t.setMilliseconds(0)
      t.setSeconds(0)
      return getT3(t)
    }
    let after = new Date(before.getTime() + d1 + d2)
    let afterDay = after.getDay()
    if (afterDay == 1 || afterDay == 0 || afterDay == 6) {
      after = new Date(after.getTime() + d2)
    }
    after = new Date(after.getTime() + 25920000)
    // 0 1 2 3 4 5 6
    // before after
    // if after == 1 || after ==0 || after ==6 plus 2 day
    // if before==0 || before ==6  make before ==1 and doit again

    return dayjs(after).format('YYYY-MM-DD HH:mm:ss')
  }
  const getT5 = function (date) {
    let before = new Date(date)
    if (before.getDay() == 0) {
      let t = new Date(before.getTime() + d1)
      t.setHours(0)
      t.setMinutes(0)
      t.setMilliseconds(0)
      t.setSeconds(0)
      return getT5(t)
    }
    if (before.getDay() == 6) {
      let t = new Date(before.getTime() + d2)
      t.setHours(0)
      t.setMinutes(0)
      t.setMilliseconds(0)
      t.setSeconds(0)
      return getT5(t)
    }
    let after = new Date(before.getTime() + d5)
    let afterDay = after.getDay()
    if (afterDay != 1) {
      after = new Date(after.getTime() + d2)
    }
    return dayjs(after).format('YYYY-MM-DD HH:mm:ss')
  }
  const del = function (i) {
    dates.splice(i, 1)
    setDates([...dates])
  }
  const onToggle = (e, i) => {
    dates.splice(i, 1, { ...e, reminder: !e.reminder })
    setDates([...dates])
  }
  const donwoad = () => {
    let datas = dates.map((e) => [e.code, e.time, e.t3, e.t5])
    let header = ['编号', '时间', '3.3天后', '5天后']
    let sheetData = [header, ...datas]
    let sheet = XLSX.utils.aoa_to_sheet(sheetData)
    let maxWidth = header.map((e) => {
      return { wch: e.length * 3 }
    })
    for (let index = 0; index < datas.length; index++) {
      for (let i = 0; i < datas[index].length; i++) {
        if ((datas[index][i] + '').toString().length * 1.2 > maxWidth[i].wch) {
          maxWidth[i].wch = (datas[index][i] + '').toString().length * 1.2
        }
      }
    }
    sheet['!cols'] = maxWidth
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheet, 'Sheet1')
    const defaultCellStyle = {
      font: { name: 'Verdana', sz: 13, color: 'FF00FF88' },
      fill: { fgColor: { rgb: 'FFFFAA00' } }
    } //设置表格的样式
    let wopts = {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary',
      cellStyles: true,
      defaultCellStyle: defaultCellStyle,
      showGridLines: false
    } //写入的样式
    let wbout = XLSX.write(wb, wopts)
    let blob = new Blob([s2ab(wbout)], {
      type: 'application/octet-stream'
    })
    fs.saveAs(blob, `${dayjs().format('YYYY-MM-DD HH:mm:ss')}.xlsx`)
  }
  const chooseFile = async (e) => {
    if (e.target.files.length) {
      let file = e.target.files[0]
      let arrayBuffer = await file.arrayBuffer()
      let data = read(arrayBuffer)

      if (data.Sheets && data.SheetNames.length) {
        let datas = utils.sheet_to_json(data.Sheets[data.SheetNames[0]])
        let t = datas.map((obj) => {
          return {
            code: obj['编号'],
            time: dayjs(new Date(obj['时间'])).format('YYYY-MM-DD HH:mm:ss'),
            t3: getT3(obj['时间']),
            t5: getT5(obj['时间']),
            reminder: true
          }
        })
        setDates([...t, ...dates])
      }
    }
  }
  const upload = () => {}
  return (
    <div>
      <div className="container">
        <header className="header">
          <h2>当前时间:{dayjs().format('YYYY-MM-DD HH:mm:ss')}</h2>
          {/* {!showAdd && (
            <button
              className="btn"
              onClick={() => {
                setShowAdd(true)
              }}
              style={{ backgroundColor: 'green' }}
            >
              添加
            </button>
          )}
          {showAdd && (
            <button
              className="btn"
              onClick={() => {
                setShowAdd(false)
              }}
              style={{ backgroundColor: 'red' }}
            >
              取消
            </button>
          )} */}

          <div className="full" align="right">
            <button
              className="btn"
              onClick={() => {
                donwoad()
              }}
            >
              导出
            </button>
            <button
              className="btn"
              onClick={() => {
                document.getElementById('uploadBtn').click()
              }}
            >
              导入
            </button>
            <input
              onChange={chooseFile}
              id="uploadBtn"
              type="file"
              style={{ display: 'none' }}
              accept=".xls,.xlsx"
            />
          </div>
        </header>
        {showAdd && (
          <form className="add-form" onSubmit={onSubmit}>
            <div className="form-control">
              <label>编号</label>
              <input
                type="text"
                placeholder="输入编号"
                value={obj.code}
                onChange={(e) => setObj({ ...obj, code: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label>时间</label>
              <input
                type="text"
                placeholder="输入时间"
                value={obj.time}
                onChange={(e) => setObj({ ...obj, time: e.target.value })}
              />
            </div>
            <div className="form-control form-control-check">
              <label>提醒</label>
              <input
                type="checkbox"
                checked={obj.reminder}
                value={obj.reminder}
                onChange={(e) => setObj({ ...obj, reminder: e.currentTarget.checked })}
              />
            </div>
            <input type="submit" value="保存" className="btn btn-block" />
          </form>
        )}
        <div>
          {dates.map((e, i) => {
            return (
              <div
                key={i}
                className={`task ${e.reminder && 'reminder'}`}
                onDoubleClick={() => onToggle(e, i)}
              >
                <h3>
                  {e.code}
                  <FaTimes style={{ color: 'red', cursor: 'pointer' }} onClick={() => del(i)} />
                </h3>
                <p> 记录时间:{e.time}</p>
                <p> 3.3天:{e.t3}</p>
                <p> 5天:{e.t5}</p>
              </div>
            )
          })}
        </div>
      </div>
      <Footer />
    </div>
  )
}
