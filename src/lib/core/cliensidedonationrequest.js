import Cliensidedonationrequest from "./cliensidedonationrequest"; 
import { userinfo } from "@/lib/core/userinfo";

export default async function Page() {
  const user = await userinfo();
  
  return <Cliensidedonationrequest userEmail={user?.email} />;
}