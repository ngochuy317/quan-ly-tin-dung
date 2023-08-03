import React, { useEffect, useState } from "react";
import cardManagementAPI from "../../../api/cardManagementAPI";
import HistoryCreditCardModal from "../../Modal/historyCreditCardModal";

function CardManagement() {
  const [dataCard, setDataCard] = useState([]);
  const [dataTableHistoryCreditCard, setDataTableHistoryCreditCard] = useState(
    []
  );
  const [params, setParams] = useState({ page: 1 });
  const [show, setShow] = useState(false);
  const [titleModal, setTitleModal] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    async function initData() {
      try {
        const response = await cardManagementAPI.getAll(params);
        console.log("Fetch creditcard successfully", response);
        setDataCard(response);
      } catch (error) {
        console.log("Failed to fetch creditcard", error);
      }
    }

    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClickCreditCard = async (e) => {
    try {
      e.preventDefault();
      let cardNumber = e.target.innerText;
      const response = await cardManagementAPI.getAllTransaction4CreditCard(
        cardNumber
      );
      console.log("Fetch creditcard successfully", response);
      setDataTableHistoryCreditCard(response);
      setTitleModal(cardNumber);
      handleShow();
    } catch (error) {
      console.log("Failed to fetch creditcard", error);
    }
  };
  return (
    <div>
      <h2 className="text-center">Quản lý thẻ</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Số thẻ</th>
              <th scope="col">Cửa hàng</th>
              <th scope="col">Số tiền</th>
              <th scope="col">Ngày quẹt</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {dataCard?.results?.map((data, index) => (
              <tr key={data.id}>
                <td>{index + 1}</td>
                <td>
                  {" "}
                  <a
                    href="/#"
                    onClick={handleOnClickCreditCard}
                    style={{ cursor: "pointer" }}
                  >
                    {data.credit_card_number}
                  </a>
                </td>
                <td>{data.store_name}</td>
                <td>{data.customer_money_needed}</td>
                <td>{data.transaction_datetime_created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <HistoryCreditCardModal
        show={show}
        handleClose={handleClose}
        title={titleModal}
        dataTableHistoryCreditCard={dataTableHistoryCreditCard}
      />
    </div>
  );
}

export default CardManagement;
