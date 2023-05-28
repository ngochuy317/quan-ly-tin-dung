import React from "react";
import { useForm } from "react-hook-form";

function UnsaveCard() {
  const { handleSubmit } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <div>
      <h2 className="text-center">Lưu thẻ</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5>Cửa hàng</h5>
      </form>
    </div>
  );
}

export default UnsaveCard;
