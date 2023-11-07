
import { sendRequest } from "@/utils/api";
import ProfileApp from "@/components/Header/app.profile";
const ProfilePage = async ({ params }: { params: { slug: string } }) => {

  const idUser = params.slug;
  const res = await sendRequest({
    url: "http://localhost:8000/api/v1/tracks/users?current=1&pageSize=10",
    method: "POST",
    body: { id: idUser },
  });
  // console.log(res?.data?.result,'check ress user')
  //@ts-ignore
  const dataUser = res?.data?.result ?? [];
  return (
    <div>
      <ProfileApp dataUser={dataUser}></ProfileApp>
    </div>
  );
};
export default ProfilePage;
