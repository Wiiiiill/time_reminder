import dayjs from "dayjs";
import Layout from "@/layout";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
export default function App() {
  const getT3 = function (date) {
    return date;
  };
  const getT5 = function (date) {
    return date;
  };
  const [ram, setRam] = useState(1);
  const [dates, setDates] = useState([]);
  useEffect(() => {
    let t = localStorage.getItem("dates");
    if (t) {
      setDates(JSON.parse(t));
    } else {
      localStorage.setItem(
        "dates",
        JSON.stringify([
          {
            code: "周二12点45分",
            time: "2024-01-02 12:45:00",
          },
          {
            code: "周五12点45分",
            time: "2024-01-05 12:45:00",
          },
        ])
      );
      setDates([
        {
          code: "周二12点45分",
          time: "2024-01-02 12:45:00",
        },
        {
          code: "周五12点45分",
          time: "2024-01-05 12:45:00",
        },
      ]);
    }

    let timer = setInterval(() => {
      setRam(Math.random());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    localStorage.setItem("dates", JSON.stringify(dates));
  }, [dates]);

  const test = function () {
    setDates([
      ...dates,
      {
        code: "周二12点45分",
        time: "2024-01-02 12:45:00",
      },
      {
        code: "周五12点45分",
        time: "2024-01-05 12:45:00",
      },
    ]);
  };
  const del = function (i) {
    console.log(dates.splice(i, 1));
    setDates([...dates]);
  };
  return (
    <Layout>
      <div className="container">
        <header className="header">
          <h2>当前时间:{dayjs().format("YYYY-MM-DD HH:mm:ss")}</h2>
          <button
            className="btn"
            onClick={test}
            style={{ backgroundColor: "steelblue" }}
          >
            Add
          </button>
        </header>
        {dates.map((e, i) => {
          return (
            <div key={i} className="task">
              <h3>
                {i}:{e.code}
                <FaTimes
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => del(i)}
                />
              </h3>
              <p> 记录时间:{e.time}</p>
              <p> 3.3天:{getT3(e.time)}</p>
              <p> 5天:{getT5(e.time)}</p>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
