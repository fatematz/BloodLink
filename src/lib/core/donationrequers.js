import MyDonationRequestsPage from "./MyDonationRequestsPage"; 
import { userinfo } from "@/lib/core/userinfo";

export default async function Page() {
  const user = await userinfo();
  
  return <MyDonationRequestsPage userEmail={user?.email} />;
}