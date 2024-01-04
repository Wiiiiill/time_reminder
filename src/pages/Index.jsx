import dayjs from "dayjs";
import Layout from "@/layout";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
!localStorage.getItem("dates") &&
  localStorage.setItem("dates", JSON.stringify([]));
export default function App() {
  const [ram, setRam] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [dates, setDates] = useState(JSON.parse(localStorage.getItem("dates")));
  const [obj, setObj] = useState({ code: "", time: "" });
  useEffect(() => {
    let timer = setInterval(() => {
      setRam(Math.random());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    localStorage.setItem("dates", JSON.stringify(dates));
    setShowAdd(false);
  }, [dates]);
  const onSubmit = (e) => {
    e.preventDefault();
    if (!obj.code) {
      alert("输入编号");
      return;
    }
    if (!obj.time) {
      alert("输入时间");
      return;
    }
    if (!isValidDate(new Date(obj.time))) {
      alert("输入可识别的时间");
      return;
    }
    setDates([
      ...dates,
      { ...obj, time: obj.time, t3: getT3(obj.time), t5: getT5(obj.time) },
    ]);
    setObj({ code: "", time: "" });
  };
  const isValidDate = function (date) {
    return date instanceof Date && !isNaN(date.getTime());
  };
  //例如说我有一期是周二12点45分上传的 那么正常来说是 周五19点45分到时
  //有一期是周五12点45分上传的 周三19点45分到时
  //然后如果是周末上传的 都统一调整为周一的00:00上传
  const d1 = 86400000;
  const d2 = 172800000;
  const d33 = 285120000;
  const d5 = 432000000;
  const getT3 = function (date) {
    let before = new Date(date);
    if (before.getDay() == 0) {
      let t = new Date(before.getTime() + d1);
      t.setHours(0);
      t.setMinutes(0);
      t.setMilliseconds(0);
      t.setSeconds(0);
      return getT3(t);
    }
    if (before.getDay() == 6) {
      let t = new Date(before.getTime() + d2);
      t.setHours(0);
      t.setMinutes(0);
      t.setMilliseconds(0);
      t.setSeconds(0);
      return getT3(t);
    }
    let after = new Date(before.getTime() + d33);
    let afterDay = after.getDay();
    if (afterDay == 1 || afterDay == 0 || afterDay == 6) {
      after = new Date(after.getTime() + d2);
    }
    // 0 1 2 3 4 5 6
    // before after
    // if after == 1 || after ==0 || after ==6 plus 2 day
    // if before==0 || before ==6  make before ==1 and doit again

    return dayjs(after).format("YYYY-MM-DD HH:mm:ss");
  };
  const getT5 = function (date) {
    let before = new Date(date);
    if (before.getDay() == 0) {
      let t = new Date(before.getTime() + d1);
      t.setHours(0);
      t.setMinutes(0);
      t.setMilliseconds(0);
      t.setSeconds(0);
      return getT5(t);
    }
    if (before.getDay() == 6) {
      let t = new Date(before.getTime() + d2);
      t.setHours(0);
      t.setMinutes(0);
      t.setMilliseconds(0);
      t.setSeconds(0);
      return getT5(t);
    }
    let after = new Date(before.getTime() + d5);
    let afterDay = after.getDay();
    if (afterDay != 1) {
      after = new Date(after.getTime() + d2);
    }
    return dayjs(after).format("YYYY-MM-DD HH:mm:ss");
  };
  const del = function (i) {
    setDates([...dates]);
  };
  return (
    <Layout>
      <div className="container">
        <header className="header">
          <h2>当前时间:{dayjs().format("YYYY-MM-DD HH:mm:ss")}</h2>
          {!showAdd && (
            <button
              className="btn"
              onClick={() => {
                setShowAdd(true);
              }}
              style={{ backgroundColor: "green" }}
            >
              添加
            </button>
          )}
          {showAdd && (
            <button
              className="btn"
              onClick={() => {
                setShowAdd(false);
              }}
              style={{ backgroundColor: "red" }}
            >
              取消
            </button>
          )}
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
            <input type="submit" value="保存" className="btn btn-block" />
          </form>
        )}
        <div>
          {dates.map((e, i) => {
            return (
              <div key={i} className="task">
                <h3>
                  {e.code}
                  <FaTimes
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => del(i)}
                  />
                </h3>
                <p> 记录时间:{e.time}</p>
                <p> 3.3天:{e.t3}</p>
                <p> 5天:{e.t5}</p>
              </div>
            );
          })}
        </div>
        <footer>
          <p>
            Developed by{" "}
            <a href="https://github.com/Wiiiiill" target="_blank">
              github.com/Wiiiiill
            </a>
          </p>
        </footer>
      </div>
    </Layout>
  );
}
