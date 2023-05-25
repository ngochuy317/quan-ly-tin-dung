import React, {useState, useEffect} from "react";
import productAPI from "../../../api/productAPI";
import { Link } from "react-router-dom";
import Pagination from "../../Pagination/pagination";


function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [responseData, setResponseData] = useState({});
  const [params, setParams] = useState({ page: 1 });


  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await productAPI.getAll(params);
        console.log("Fetch products list successfully", response);

        setResponseData(response);
      } catch (error) {
        console.log("Failed to fetch products list", error);
      }
    };

    fetchProductList();
  }, [params]);

  const handleChangePage = (direction) => {
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

  return (
    <div>
      <h2 className="text-center">Danh sách sản phẩm</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Đơn giá</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseData.results &&
              responseData.results.map((product, index) => (
                <tr key={product.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <Link to={product.id + "/"}>Chỉnh sửa</Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={responseData.total_pages}
        handleChangePage={handleChangePage}
      />
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-outline-primary">
          <Link to="add" style={{ textDecoration: "none", color: "inherit" }}>
            Thêm
          </Link>
        </button>
      </div>
    </div>
  );
}

export default ProductList;
