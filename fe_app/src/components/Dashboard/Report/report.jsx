import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import reportApi from "../../../api/reportAPI";
import storeApi from "../../../api/storeAPI";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import Pagination from "../../Pagination/pagination";
import { AuthContext } from "../dashboard";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

function Report() {
  const { role } = useContext(AuthContext);
  const isAdmin = role === "admin";
  const [stores, setStores] = useState([]);
  const [poses, setPoses] = useState([]);
  const [dataPieChart, setDataPieChart] = useState([]);
  const [responseSwipeCardData, setResponseSwipeCardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMoneyToday, setTotalMoneyToday] = useState(0);
  const [params, setParams] = useState({ page: 1 });
  const { register, handleSubmit } = useForm();

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {dataPieChart[index].name}: {value ? value.toLocaleString() : value}
      </text>
    );
  };

  useEffect(() => {
    async function fetchListStore() {
      try {
        if (isAdmin) {
          const responseJSONStore = await storeApi.getAllFull();
          console.log("Fetch store list successfully", responseJSONStore);
          setStores(responseJSONStore);
        }
      } catch (error) {
        console.log("Failed to fetch notebook detail", error);
      }
    }

    fetchListStore();
  }, [isAdmin]);

  useEffect(() => {
    async function fetchTotalMoneyToday() {
      try {
        if (isAdmin) {
          const responseTotalMoney = await reportApi.gettotalmoneytoday();
          console.log(
            "Fetch total money today successfully",
            responseTotalMoney
          );
          setTotalMoneyToday(responseTotalMoney.total_money);
        }
      } catch (error) {
        console.log("Failed to fetch total money today", error);
      }
    }

    fetchTotalMoneyToday();
  }, [isAdmin]);

  const onSubmit = async (data) => {
    try {
      console.log("data", data);
      const response = await swipeCardTransactionAPI.getAll({
        ...params,
        ...data,
      });
      console.log("Get swipecard transaction successfully", response);
      setResponseSwipeCardData(response);
      let remain_money =
        response.money_limit_per_day - response.sum_customer_money_needed;
      console.log("remain_money", remain_money);
      let remain_money_color = "";
      let remain_money_name = "";
      if (remain_money > 0) {
        remain_money_color = "#999999";
        remain_money_name = "Còn lại";
      } else {
        remain_money = Math.abs(remain_money);
        remain_money_color = "#cc0000";
        remain_money_name = "Vượt quá";
      }
      setDataPieChart([
        {
          name: "Số tiền đã quẹt",
          value: response.sum_customer_money_needed,
          color: "#37a410",
        },
        {
          name: remain_money_name,
          value: remain_money,
          color: remain_money_color,
        },
      ]);
    } catch (error) {
      console.log("Failed to Get swipecard transaction", error);
    }
  };

  const handleOnChange = (e) => {
    let val = parseInt(e.target.value);
    let store = stores.find((c) => c.id === val);
    setPoses([...store.poses]);
    console.log("store", poses);
  };

  const handleChangePage = (direction) => {
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

  return (
    <div>
      <h2 className="text-center">Thống kê</h2>
      {isAdmin && (
        <div className="row">
          <div className="col-md-8">
            <strong>
              Tổng tiền trong ngày của tất cả cửa hàng:{" "}
              {totalMoneyToday?.toLocaleString() || 0} VND
            </strong>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Cửa hàng</label>
              {isAdmin ? (
                <select
                  {...register("store_id", { required: true })}
                  className="form-select"
                  onChange={handleOnChange}
                >
                  {stores?.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...register("store_id")}
                  type="text"
                  className="form-control"
                  disabled
                />
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Máy POS</label>
              <select
                {...register("pos")}
                className="form-select"
                disabled={poses.length > 0 ? null : true}
              >
                {poses ? <option value="">Tất cả</option> : null}
                {poses?.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    {pos.pos_id}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ngày giao dịch</label>
              <input
                {...register("transaction_datetime")}
                type="date"
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-outline-primary mx-3">
            Xem
          </button>
        </div>
      </form>
      <h2 className="text-center">Lịch sử quẹt thẻ</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart width={400} height={400}>
          <Pie
            data={dataPieChart}
            cx="50%"
            cy="50%"
            label={renderCustomizedLabel}
            outerRadius={120}
            dataKey="value"
          >
            {dataPieChart.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Ngày giao dịch</th>
              <th scope="col">Tên khách hàng</th>
              <th scope="col">SDT khách hàng</th>
              <th scope="col">Số tiền KH cần</th>
              <th scope="col">Phí</th>
              {/* <th scope="col">Thao tác</th> */}
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseSwipeCardData?.results?.map((swipeCard, index) => (
              <tr key={swipeCard.id}>
                <th scope="row">{index + 1}</th>
                <td>{swipeCard.transaction_datetime}</td>
                <td>{swipeCard.customer_name}</td>
                <td>{swipeCard.customer_phone_number}</td>
                <td>{swipeCard.customer_money_needed.toLocaleString("vn")}</td>
                <td>{swipeCard.fee}</td>
                {/* <td>
                    <Link to={swipeCard.id + "/"}>Chỉnh sửa</Link>
                  </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {responseSwipeCardData.results ? (
        <div className="d-flex justify-content-end">
          Tổng tiền:{" "}
          {responseSwipeCardData.sum_customer_money_needed.toLocaleString("vn")}
        </div>
      ) : (
        <div></div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={responseSwipeCardData.total_pages}
        handleChangePage={handleChangePage}
      />
    </div>
  );
}

export default Report;
