"use client";
import axios from "axios";
import { useState } from "react";

const PayHereForm = ({ orderDetails }) => {
  const [hash, setHash] = useState("");

  const merchant_id = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;

  const generateHash = async () => {
    try {
      const response = await axios.post("/api/payment/hash", orderDetails);
      if (response.status === 200) {
        setHash(response.data.hash);
        return response.data.hash;
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later!");
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const generatedHash = await generateHash();
    if (generatedHash) {
      document.querySelector('input[name="hash"]').value = generatedHash;

      document.getElementById("payhere-form").submit();
    }
  };

  return (
    <div>
      <form
        id="payhere-form"
        method="post"
        action="https://sandbox.payhere.lk/pay/checkout"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="merchant_id" value={merchant_id} />
        <input
          type="hidden"
          name="return_url"
          value="https://nextdrive.lk/overview"
        />
        <input
          type="hidden"
          name="cancel_url"
          value="https://nextdrive.lk/manage-listings"
        />
        <input
          type="hidden"
          name="notify_url"
          value="https://api.nextdrive.lk/api/payment/notify"
        />
        <input type="hidden" name="order_id" value={orderDetails.order_id} />
        <input type="hidden" name="items" value="Your Order Description" />
        <input type="hidden" name="currency" value="LKR" />
        <input type="hidden" name="amount" value={orderDetails.amount} />
        <input type="hidden" name="hash" value={hash} />

        {/* Customer Information */}
        <input
          type="hidden"
          name="first_name"
          value={orderDetails.first_name}
          readOnly
        />
        <input
          type="hidden"
          name="last_name"
          value={orderDetails.last_name}
          readOnly
        />
        <input type="hidden" name="email" value={orderDetails.email} readOnly />
        <input type="hidden" name="phone" value={orderDetails.phone} readOnly />
        <input
          type="hidden"
          name="address"
          value={orderDetails.address}
          readOnly
        />
        <input type="hidden" name="city" value={orderDetails.city} readOnly />
        <input type="hidden" name="country" value={orderDetails.country} />

        {/* Additional Information */}
        <input
          type="hidden"
          name="custom_1"
          value={JSON.stringify(orderDetails.custom_1)}
        />
        <input
          type="hidden"
          name="custom_2"
          value={JSON.stringify(orderDetails.custom_2)}
        />

        <button
          type="submit"
          className="tw-px-3 tw-w-full tw-py-2.5 tw-bg-black tw-rounded-lg tw-text-font14 tw-text-white hover:tw-bg-[#1a3760]"
        >
          Continue to Pay
        </button>
      </form>
    </div>
  );
};

export default PayHereForm;
