import PendingPaymentDialog from "./payment";

async function getPaymentRequest() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-payment-request`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },

  });
  return data.json();
}


export default async function PaymentRequestPage() {
  const data = await getPaymentRequest();

  console.log("Fetched data:", data);

  return <>
  {/* <PendingPaymentDialog data={data} /> */}
  </>

}